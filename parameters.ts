 import { Aws } from "aws-cdk-lib";
import { InstanceClass, InstanceSize, InstanceType } from "aws-cdk-lib/aws-ec2";
import { AuroraCapacityUnit, StorageType } from "aws-cdk-lib/aws-rds";

export const Parameters = {
    stf_iot: {
        new_bucket: true, // If true, the stack will create the bucket for the STF IoT DataLake. Set to false if you have already a bucket created. 
        bucket_name: `stf-iot-datalake-${Aws.REGION}-${Aws.ACCOUNT_ID}`, // Default name, change only if needed.
        shadow_prefix: "Stf",
        sqs_iot_queue_name: `StfIoTQueue-${Aws.REGION}`, // Default name, change only if needed.
        smart_data_model_url : 'https://raw.githubusercontent.com/smart-data-models/data-models/master/context.jsonld',
        timeout: '0', // Timeout for the API call in the Lambda that sync with context broker. Has to be a string to pass it in env variable 
        shadow_indexing: false // Activating Fleet Indexing for the shadows will occur costs, see https://aws.amazon.com/iot-device-management/pricing/ 
    }, 
    stf_scorpio: {
        image_context_broker: 'public.ecr.aws/scorpiobroker/scorpio-aio:latest', // Link to ECR Public gallery of Scorpio Broker image.
        rds_instance_type: InstanceType.of( InstanceClass.BURSTABLE4_GRAVITON, InstanceSize.SMALL), // see https://aws.amazon.com/rds/instance-types/
        rds_storage_type: StorageType.GP3, // see https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Storage.html
        dabaseName: 'scorpio',
        aurora_serverless: false, // If false, this creates a RDS PostgreSQL Database instance. If true, this creates an Aurora Cluster.  
        aurora_scaling: {
            maxCapacity: AuroraCapacityUnit.ACU_4,
            minCapacity: AuroraCapacityUnit.ACU_2      
        },
        kafka_config_name: `stf-kafka-config`,
        kafka_number_nodes: 2,
        kafka_version: "3.3.1", // see https://docs.aws.amazon.com/msk/latest/developerguide/supported-kafka-versions.html  
        kafka_instance_type: "kafka.t3.small", // see https://docs.aws.amazon.com/msk/latest/developerguide/bestpractices.html
        kafka_cluster_name: 'ScorpioCluster', 
        kafka_storage_size: 100, //  see https://docs.aws.amazon.com/msk/latest/developerguide/bestpractices.html
        fargate_desired_count: 2
    },
    vpc_link_name: 'scorpio-serverless-vpc-link'
}