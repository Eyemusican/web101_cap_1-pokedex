
pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS-20.x'
    }
    
    environment {
        CI = 'true'
        DOCKER_IMAGE = 'eyemusician/pokedex-app'  
        DOCKER_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                bat 'npm install'  
            }
        }
        
        stage('Build') {
            steps {
                bat 'npm run build'  
            }
        }
        
        stage('Test') {
            steps {
                bat 'npm test'  
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                    docker.build("${DOCKER_IMAGE}:latest")
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                        docker.image("${DOCKER_IMAGE}:latest").push()
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                bat 'npm run deploy:prod'  
            }
        }
    }
    
    post {
        always {
            bat 'docker image prune -f'  
        }
    }
}