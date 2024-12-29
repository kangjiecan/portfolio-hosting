aws cloudformation create-stack \
  --stack-name my-storage-stack \
  --template-body file://s3-template.yaml \
  --parameters \
    ParameterKey=BucketName,ParameterValue=mediaHost \
    ParameterKey=Region,ParameterValue=ca-central-1# Delete existing stack
aws cloudformation delete-stack --stack-name my-storage-stack

# Wait for deletion to complete, then create new stack
aws cloudformation wait stack-delete-complete --stack-name my-storage-stack

# Create new stack
aws cloudformation create-stack \
  --stack-name my-storage-stack \
  --template-body file://template.yaml \
  --parameters \
    ParameterKey=BucketName,ParameterValue=my-unique-bucket \
    ParameterKey=Region,ParameterValue=us-east-1