# eval $(minikube -p minikube docker-env)
#
# docker build -f ./dist/apps/news-train/Dockerfile . -t news-train

# cd apps/news-train

# kubectl delete -n default service news-train
# kubectl delete -n default deployment news-train
# kubectl delete -f apps/news-train/deployment.yaml
# kubectl create -f apps/news-train/deployment.yaml
# kubectl delete -f apps/news-train/service.yaml
# kubectl create -f apps/news-train/service.yaml
# kubectl expose deployment news-train --type=NodePort

netlify deploy --dir=./dist/apps/news-train

# docker build -t news-train .
#
# kubectl delete -f deployment.yaml
# kubectl create -f deployment.yaml
# kubectl delete -f service.yaml
# kubectl create -f service.yaml
# kubectl expose deployment news-train --type=NodePort

# minikube service news-train --url
# minikube service news-train

# NOTES:
# 1. Get the application URL by running these commands:
#   export NODE_PORT=$(kubectl get --namespace default -o jsonpath="{.spec.ports[0].nodePort}" services docker-registry-mirror)
#   export NODE_IP=$(kubectl get nodes --namespace default -o jsonpath="{.items[0].status.addresses[0].address}")
#   echo http://$NODE_IP:$NODE_PORT
# 2. Get registry nodePort by running command:
#   kubectl get --namespace default -o jsonpath="{.spec.ports[0].nodePort}" services docker-registry-mirror
