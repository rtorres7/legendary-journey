SHELL = /bin/bash
REGISTRY := registry.local:5000
SERVER_IMAGE := mxms-server
UI_IMAGE := mxms-ui
LIQUIBASE_IMAGE := mxms-liquibase
KEYCLOAK_IMAGE := mxms-keycloak
POSTGRES_IMAGE := mxms-postgres
NGINX_IMAGE := mxms-nginx

.PHONY: integration-up
integration-up: TAG := $(shell date +"%Y-%m-%d-%I-%M-%S")
integration-up: FULL_SERVER_IMAGE := $(REGISTRY)/$(SERVER_IMAGE):$(TAG)
integration-up: REPLACE_SERVER_IMAGE := $(REGISTRY)\/$(SERVER_IMAGE):$(TAG)
integration-up: FULL_UI_IMAGE := $(REGISTRY)/$(UI_IMAGE):$(TAG)
integration-up: REPLACE_UI_IMAGE := $(REGISTRY)\/$(UI_IMAGE):$(TAG)
integration-up: FULL_LIQUIBASE_IMAGE := $(REGISTRY)/$(LIQUIBASE_IMAGE):$(TAG)
integration-up: REPLACE_LIQUIBASE_IMAGE := $(REGISTRY)\/$(LIQUIBASE_IMAGE):$(TAG)
integration-up: FULL_KEYCLOAK_IMAGE := $(REGISTRY)/$(KEYCLOAK_IMAGE):$(TAG)
integration-up: REPLACE_KEYCLOAK_IMAGE := $(REGISTRY)\/$(KEYCLOAK_IMAGE):$(TAG)
integration-up: FULL_POSTGRES_IMAGE := $(REGISTRY)/$(POSTGRES_IMAGE):$(TAG)
integration-up: REPLACE_POSTGRES_IMAGE := $(REGISTRY)\/$(POSTGRES_IMAGE):$(TAG)
integration-up: FULL_NGINX_IMAGE := $(REGISTRY)/$(NGINX_IMAGE):$(TAG)
integration-up: REPLACE_NGINX_IMAGE := $(REGISTRY)\/$(NGINX_IMAGE):$(TAG)
integration-up:
	@echo
	@echo "Start K3s cluster and registry locally."
	docker-compose \
		-f ./docker-compose.yml \
		-f ./docker-compose-registry.yml \
		up -d

	@echo
	@echo "Deploy UI dashboard"
	kubectl --kubeconfig=./kubeconfig.yaml apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
	kubectl --kubeconfig=./kubeconfig.yaml apply -f dashboard.yml

	@echo
	@echo "Build Postgres (multiple db) Image."
	docker build ./postgres -t "$(FULL_POSTGRES_IMAGE)"

	@echo
	@echo "Push Postgres (multiple db) Image."
	docker push "$(FULL_POSTGRES_IMAGE)"

	@echo
	@echo "Build Keycloak Image."
	docker build ../keycloak -t "$(FULL_KEYCLOAK_IMAGE)"

	@echo
	@echo "Push Keycloak Image."
	docker push "$(FULL_KEYCLOAK_IMAGE)"

	@echo
	@echo "Build NGINX Image."
	cp -R ../certs/* ./nginx/certs/
	docker build ./nginx -t "$(FULL_NGINX_IMAGE)"
	rm -rf ./nginx/certs/*

	@echo
	@echo "Push NGINX Image."
	docker push "$(FULL_NGINX_IMAGE)"

	@echo
	@echo "Build Liquibase Image."
	cp -R ../server/src/migrations/* ./liquibase/migrations/
	docker build ./liquibase -t "$(FULL_LIQUIBASE_IMAGE)"
	rm -rf ./liquibase/migrations/*

	@echo
	@echo "Push Liquibase Image."
	docker push "$(FULL_LIQUIBASE_IMAGE)"

	@echo
	@echo "Build MXMS Server image."
	docker build ../server \
		-f ../server/production.Dockerfile \
		-t "$(FULL_SERVER_IMAGE)"

	@echo
	@echo "Push MXMS Server image to local registry."
	docker push "$(FULL_SERVER_IMAGE)"

	@echo
	@echo "Build MXMS UI image."
	docker build ../client \
		-f ../client/production.Dockerfile \
		-t "$(FULL_UI_IMAGE)"

	@echo
	@echo "Push MXMS UI image to local registry."
	docker push "$(FULL_UI_IMAGE)"

	@echo
	@echo "Clean up locally built images"
	docker image rm "$(FULL_SERVER_IMAGE)" "$(FULL_KEYCLOAK_IMAGE)" "$(FULL_POSTGRES_IMAGE)" "$(FULL_LIQUIBASE_IMAGE)" "$(FULL_NGINX_IMAGE)" "$(FULL_UI_IMAGE)"

	@echo
	@echo "Apply Resources definitions to K3s cluster."
	cat ./resources.yml | \
		sed "s/{{KEYCLOAK_IMAGE_WITH_TAG}}/$(REPLACE_KEYCLOAK_IMAGE)/g" | \
		sed "s/{{POSTGRES_IMAGE_WITH_TAG}}/$(REPLACE_POSTGRES_IMAGE)/g" | \
		kubectl --kubeconfig=./kubeconfig.yaml apply -f -

	@echo
	@echo "Waiting for resources to finish."
	until kubectl --kubeconfig=./kubeconfig.yaml rollout status deployment resources; do sleep 1; done

	@echo
	@echo "Apply Deployment definitions to K3s cluster."
	cat ./deployment.yaml | \
		sed "s/{{SERVER_IMAGE_WITH_TAG}}/$(REPLACE_SERVER_IMAGE)/g" | \
		sed "s/{{NGINX_IMAGE_WITH_TAG}}/$(REPLACE_NGINX_IMAGE)/g" | \
		sed "s/{{LIQUIBASE_IMAGE_WITH_TAG}}/$(REPLACE_LIQUIBASE_IMAGE)/g" | \
		sed "s/{{UI_IMAGE_WITH_TAG}}/$(REPLACE_UI_IMAGE)/g" | \
		kubectl --kubeconfig=./kubeconfig.yaml apply -f -

	@echo
	@echo "Waiting for deployment to finish."
	until kubectl --kubeconfig=./kubeconfig.yaml rollout status deployment mxms; do sleep 1; done

	@echo
	@echo "Apply ingress definitions to K3s cluster."
	cat ./ingress.yml | \
		sed "s/{{NGINX_IMAGE_WITH_TAG}}/$(REPLACE_NGINX_IMAGE)/g" | \
		kubectl --kubeconfig=./kubeconfig.yaml apply -f -

	@echo
	@echo "Waiting for ingress to finish."
	until kubectl --kubeconfig=./kubeconfig.yaml rollout status deployment ingress; do sleep 1; done

	@echo
	@echo "Generate dashboard token: Use the following token when opening browser to http://127.0.0.1:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/"
	kubectl --kubeconfig=./kubeconfig.yaml -n kubernetes-dashboard create token admin-user

.PHONY: integration-down
integration-down:
	@echo
	@echo "Stop K3s cluster and registry locally."
	docker-compose \
		-f ./docker-compose.yml \
		-f ./docker-compose-registry.yml \
		down
