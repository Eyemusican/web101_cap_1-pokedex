pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS-20.x'  // Keep the same tool name that's working
    }
    
    environment {
        CI = 'true'
        DOCKER_IMAGE = 'eyemusician/pokedex-app'  // Change this to your Docker Hub username
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
                sh 'npm install'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        
        // NEW DOCKER STAGES ADDED HERE
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
                sh 'npm run deploy:prod'
            }
        }
    }
    
    post {
        always {
            sh 'docker image prune -f'
        }
    }
}