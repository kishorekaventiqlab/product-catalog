import json
import boto3
import os
import uuid
from datetime import datetime
from decimal import Decimal
from boto3.dynamodb.conditions import Key

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get('TABLE_NAME')
table = dynamodb.Table(table_name)

# Custom JSON encoder for DynamoDB Decimal types
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def create_response(status_code, body):
    """Create API Gateway response with CORS headers"""
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
        },
        'body': json.dumps(body, cls=DecimalEncoder)
    }

def create_product(body):
    """Create a new product"""
    try:
        product_id = str(uuid.uuid4())
        timestamp = int(datetime.now().timestamp())
        
        item = {
            'productId': product_id,
            'name': body.get('name'),
            'description': body.get('description', ''),
            'price': Decimal(str(body.get('price', 0))),
            'category': body.get('category', 'General'),
            'stock': body.get('stock', 0),
            'createdAt': timestamp,
            'updatedAt': timestamp
        }
        
        table.put_item(Item=item)
        
        return create_response(201, {
            'message': 'Product created successfully',
            'product': item
        })
    except Exception as e:
        return create_response(500, {
            'error': f'Failed to create product: {str(e)}'
        })

def get_product(product_id):
    """Get a single product by ID"""
    try:
        response = table.get_item(Key={'productId': product_id})
        
        if 'Item' not in response:
            return create_response(404, {
                'error': 'Product not found'
            })
        
        return create_response(200, {
            'product': response['Item']
        })
    except Exception as e:
        return create_response(500, {
            'error': f'Failed to retrieve product: {str(e)}'
        })

def list_products(query_params):
    """List all products with optional filtering"""
    try:
        # Get pagination parameters
        limit = int(query_params.get('limit', 50))
        last_key = query_params.get('lastKey')
        
        scan_kwargs = {
            'Limit': limit
        }
        
        if last_key:
            scan_kwargs['ExclusiveStartKey'] = {'productId': last_key}
        
        response = table.scan(**scan_kwargs)
        
        result = {
            'products': response.get('Items', []),
            'count': len(response.get('Items', []))
        }
        
        if 'LastEvaluatedKey' in response:
            result['lastKey'] = response['LastEvaluatedKey']['productId']
        
        return create_response(200, result)
    except Exception as e:
        return create_response(500, {
            'error': f'Failed to list products: {str(e)}'
        })

def update_product(product_id, body):
    """Update an existing product"""
    try:
        # First check if product exists
        existing = table.get_item(Key={'productId': product_id})
        if 'Item' not in existing:
            return create_response(404, {
                'error': 'Product not found'
            })
        
        timestamp = int(datetime.now().timestamp())
        
        # Build update expression dynamically
        update_expr = "SET updatedAt = :timestamp"
        expr_values = {':timestamp': timestamp}
        expr_names = {}
        
        if 'name' in body:
            update_expr += ", #n = :name"
            expr_values[':name'] = body['name']
            expr_names['#n'] = 'name'
        
        if 'description' in body:
            update_expr += ", description = :description"
            expr_values[':description'] = body['description']
        
        if 'price' in body:
            update_expr += ", price = :price"
            expr_values[':price'] = Decimal(str(body['price']))
        
        if 'category' in body:
            update_expr += ", category = :category"
            expr_values[':category'] = body['category']
        
        if 'stock' in body:
            update_expr += ", stock = :stock"
            expr_values[':stock'] = body['stock']
        
        update_kwargs = {
            'Key': {'productId': product_id},
            'UpdateExpression': update_expr,
            'ExpressionAttributeValues': expr_values,
            'ReturnValues': 'ALL_NEW'
        }
        
        if expr_names:
            update_kwargs['ExpressionAttributeNames'] = expr_names
        
        response = table.update_item(**update_kwargs)
        
        return create_response(200, {
            'message': 'Product updated successfully',
            'product': response['Attributes']
        })
    except Exception as e:
        return create_response(500, {
            'error': f'Failed to update product: {str(e)}'
        })

def delete_product(product_id):
    """Delete a product"""
    try:
        # First check if product exists
        existing = table.get_item(Key={'productId': product_id})
        if 'Item' not in existing:
            return create_response(404, {
                'error': 'Product not found'
            })
        
        table.delete_item(Key={'productId': product_id})
        
        return create_response(200, {
            'message': 'Product deleted successfully'
        })
    except Exception as e:
        return create_response(500, {
            'error': f'Failed to delete product: {str(e)}'
        })

def handler(event, context):
    """Main Lambda handler for API Gateway proxy integration"""
    try:
        # Log the incoming event
        print(f"Event: {json.dumps(event)}")
        
        http_method = event.get('httpMethod', '')
        path = event.get('path', '')
        path_parameters = event.get('pathParameters') or {}
        query_parameters = event.get('queryStringParameters') or {}
        
        # Parse body if present
        body = {}
        if event.get('body'):
            try:
                body = json.loads(event['body'])
            except json.JSONDecodeError:
                return create_response(400, {
                    'error': 'Invalid JSON in request body'
                })
        
        # Handle OPTIONS requests (CORS preflight)
        if http_method == 'OPTIONS':
            return create_response(200, {
                'message': 'CORS preflight successful'
            })
        
        # Route requests based on HTTP method and path
        if path == '/products' or path == '/products/':
            if http_method == 'GET':
                return list_products(query_parameters)
            elif http_method == 'POST':
                if not body.get('name'):
                    return create_response(400, {
                        'error': 'Product name is required'
                    })
                return create_product(body)
            else:
                return create_response(405, {
                    'error': f'Method {http_method} not allowed on /products'
                })
        
        # Handle /products/{productId} paths
        elif '/products/' in path:
            product_id = path_parameters.get('proxy') or path.split('/products/')[-1]
            
            if not product_id:
                return create_response(400, {
                    'error': 'Product ID is required'
                })
            
            if http_method == 'GET':
                return get_product(product_id)
            elif http_method == 'PUT':
                return update_product(product_id, body)
            elif http_method == 'DELETE':
                return delete_product(product_id)
            else:
                return create_response(405, {
                    'error': f'Method {http_method} not allowed on /products/{{id}}'
                })
        
        # Unknown path
        else:
            return create_response(404, {
                'error': f'Path not found: {path}'
            })
    
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return create_response(500, {
            'error': f'Internal server error: {str(e)}'
        })
