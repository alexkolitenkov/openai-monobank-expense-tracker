.PHONY: rundaemon
rundaemon: ## Run docker daemon
	dockerd &> /dev/null &

.PHONY: rundaemon
test_ava:
	docker build . -t ci-test
	docker stop be || true && docker rm be || true
	docker run --name be -p 8080:8080 -d ci-test
	docker exec be npm run test:ava
