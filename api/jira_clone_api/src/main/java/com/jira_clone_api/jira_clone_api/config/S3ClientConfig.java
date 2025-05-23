package com.jira_clone_api.jira_clone_api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.*;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3AsyncClient;

@Configuration
public class S3ClientConfig {

    @Value("${aws.accessKeyId}")
    private String accessKey;

    @Value("${aws.secretKey}")
    private String secretKey;

    @Bean
    public S3AsyncClient initS3AsyncClient() {
        AwsCredentialsProvider provider = StaticCredentialsProvider.create(AwsBasicCredentials.create(this.accessKey,this.secretKey));
        return S3AsyncClient
                .crtBuilder()
                .credentialsProvider(provider)
                .region(Region.AP_SOUTH_1)
                .targetThroughputInGbps(1.0)
                .minimumPartSizeInBytes(8*1024*1024L)
                .build();
    }
}
