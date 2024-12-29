#!/bin/bash

# Set local endpoint
ENDPOINT="--endpoint-url http://localhost:8000"

# Function to delete table if it exists
delete_if_exists() {
    local table_name=$1
    if aws dynamodb describe-table --table-name $table_name $ENDPOINT >/dev/null 2>&1; then
        echo "Deleting existing table: $table_name"
        aws dynamodb delete-table --table-name $table_name $ENDPOINT
        aws dynamodb wait table-not-exists --table-name $table_name $ENDPOINT
        echo "Table $table_name deleted successfully"
    fi
}

# Delete existing tables if they exist
delete_if_exists "UserTable"
delete_if_exists "PostTable"
delete_if_exists "MediaTable"

echo "Creating UserTable..."
aws dynamodb create-table \
    --table-name UserTable \
    --attribute-definitions \
        AttributeName=userID,AttributeType=S \
    --key-schema \
        AttributeName=userID,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    $ENDPOINT

echo "Creating PostTable..."
aws dynamodb create-table \
    --table-name PostTable \
    --attribute-definitions \
        AttributeName=postID,AttributeType=S \
        AttributeName=userID,AttributeType=S \
    --key-schema \
        AttributeName=postID,KeyType=HASH \
    --global-secondary-indexes \
        "[{
            \"IndexName\": \"UserPosts\",
            \"KeySchema\": [{\"AttributeName\":\"userID\",\"KeyType\":\"HASH\"}],
            \"Projection\": {\"ProjectionType\":\"ALL\"},
            \"ProvisionedThroughput\": {\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}
        }]" \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    $ENDPOINT

echo "Creating MediaTable..."
aws dynamodb create-table \
    --table-name MediaTable \
    --attribute-definitions \
        AttributeName=mediaID,AttributeType=S \
        AttributeName=userID,AttributeType=S \
    --key-schema \
        AttributeName=mediaID,KeyType=HASH \
    --global-secondary-indexes \
        "[{
            \"IndexName\": \"UserMedia\",
            \"KeySchema\": [{\"AttributeName\":\"userID\",\"KeyType\":\"HASH\"}],
            \"Projection\": {\"ProjectionType\":\"ALL\"},
            \"ProvisionedThroughput\": {\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}
        }]" \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    $ENDPOINT

# Wait for tables to be created
echo "Waiting for tables to be created..."
aws dynamodb wait table-exists --table-name UserTable $ENDPOINT
aws dynamodb wait table-exists --table-name PostTable $ENDPOINT
aws dynamodb wait table-exists --table-name MediaTable $ENDPOINT
echo "All tables created successfully!"

# Insert test data with auto-generated IDs
echo "Inserting test data..."

# Create test user
USER_ID="user_$(uuidgen)"
aws dynamodb put-item \
    --table-name UserTable \
    --item "{
        \"userID\": {\"S\": \"$USER_ID\"},
        \"username\": {\"S\": \"testuser\"},
        \"email\": {\"S\": \"test@example.com\"},
        \"createdDate\": {\"S\": \"$(date -Iseconds)\"}
    }" \
    $ENDPOINT

# Create test post
POST_ID="post_$(uuidgen)"
aws dynamodb put-item \
    --table-name PostTable \
    --item "{
        \"postID\": {\"S\": \"$POST_ID\"},
        \"userID\": {\"S\": \"$USER_ID\"},
        \"postTitle\": {\"S\": \"Test Post\"},
        \"postContent\": {\"S\": \"This is a test post\"},
        \"label\": {\"S\": \"test\"},
        \"lastModified\": {\"S\": \"$(date -Iseconds)\"}
    }" \
    $ENDPOINT

# Create test media
MEDIA_ID="media_$(uuidgen)"
aws dynamodb put-item \
    --table-name MediaTable \
    --item "{
        \"mediaID\": {\"S\": \"$MEDIA_ID\"},
        \"userID\": {\"S\": \"$USER_ID\"},
        \"filename\": {\"S\": \"test.jpg\"},
        \"filetype\": {\"S\": \"image/jpeg\"},
        \"filesize\": {\"S\": \"1024\"},
        \"uploadDate\": {\"S\": \"$(date -Iseconds)\"}
    }" \
    $ENDPOINT

echo "Test data inserted successfully!"

# List all tables and their items
echo "Listing tables and their contents:"
for table in UserTable PostTable MediaTable; do
    echo "Contents of $table:"
    aws dynamodb scan --table-name $table $ENDPOINT
done