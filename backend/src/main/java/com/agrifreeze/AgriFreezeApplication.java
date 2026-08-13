package com.agrifreeze;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.agrifreeze.repository")
@EnableMongoRepositories(basePackages = "com.agrifreeze.nosql.repository")
public class AgriFreezeApplication {

    public static void main(String[] args) {
        SpringApplication.run(AgriFreezeApplication.class, args);
    }

}
