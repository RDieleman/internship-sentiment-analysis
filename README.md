# Internship Sentiment Analysis

## Table of Contents

1. [Background Info](#background-info)
2. [Technology Stack](#technology-stack)
3. [Project Hierarchy](#project-hierarchy)
4. [Architecture](#architecture)
5. [Deployments](#deployments)
6. [Repository Setup](#repository-setup)
7. [Local Development Setup](#local-development-setup)
8. [Server Setup](#server-setup)
9. [Known Issues](#known-issues)

## Background Info

This project is the result from a software internship. The aim of the project was to leverage sentiment analysis AI to resolve encountered problems and to explore the new possibilities the AI offers.

## Technology Stack

The project, mainly, uses the following technologies:

| Category               | Technologies & Tools                     |
| ---------------------- | ---------------------------------------- |
| Version Management     | GitHub, Git LFS                          |
| CI/CD                  | GitHub Actions                           |
| Cluster Infrastructure | Kubernetes, Docker, Skaffold, Kustomize  |
| Task Automation        | Batch & Shell Scripting                  |
| Quality Control        | ESLint, Prettier, EditorConfig           |
| Frontend               | React.js                                 |
| Backend                | MongoDB, Express.js, Node.js, TypeScript |
| Sentiment AI           | Python, Django                           |

## Project Hierarchy

The project is structured in the following way:

| File/Directory | Purpose         | Description                                                                                                    |
| -------------- | --------------- | -------------------------------------------------------------------------------------------------------------- |
| .github        | CI/CD           | Contains workflows and actions for continuous integration and continuous deployment.                           |
| app            | Microservices   | Contains the codebases for the different microservices.                                                        |
| config         | Configurations  | Stores the runtime environment variable configurations (i.e., dev, test, stage, prod).                         |
| infra          | Infrastructure  | Holds the Kubernetes cluster configurations specific to different environments (i.e., dev, test, stage, prod). |
| packages       | Custom Packages | Contains custom packages used by the app.                                                                      |
| sentiment-ai   | AI Component    | Houses the sentiment analysis Python project.                                                                  |
| skaffold.yaml  | Deployment      | Configures the building and deploying of the app.                                                              |

## Architecture

### App

As described, the app implements a microservice architecture with pub/sub messaging. The following is an overview of one of the latest versions of the app:

### Client

Looking closer, the client uses React.js and is structured in the following way:

- `Pages` - the pages and their routing hierarchy.
- `Components` - smaller, reusable components.
- `Contexts` - globally available states/functionalities (e.g., authentication, websocket, notifications)
- `Hooks` - instance specific states/functionalties. (e.g., chat functionality, API call)

### Backend Services

The backend services, using Node.js and Express.js, are structured in the following way:

- `Index & Server` - entry point for the app.
- `interfaces` - abstractions of models, repositories, services, etc.
- `Routers` - validating data & passing on incoming messages.
- `Events` - validating data & passing on incoming and outgoing messages.
- `Services`- handling business logic.
- `Repositories` - interaction with the database.
- `inversify.config.ts`- handling dependency injection for abstractions.

## Deployments

As part of the CI/CD setup, the project contains GithubActions for the following workflows:

### Feature Development

1. Branch is created for a feature.
2. Pull request is created/updated.
3. Code is tested for linting & security errors.
4. Test version is deployed in a unique namespace (e.g., `pr-50`) of the cluster, and made available online for manual testing (e.g., `https://pr-50.example.com`).
5. Pull request is closed/merged.
6. Test version is deleted.

### Version Releasing

1. New latest release is created from the main branch.
2. Latest release is deployed in the `prod` namespace of the cluster.

### AI Development

The development of the AI project follows roughly the same flow as normal feature development, but is excluded from being build as part of the test deployment due to the resource intensity.

However, a new version is automatically deployed if changes in the `sentiment-ai` directory are pushed to the main branch. Additionally, it can also be manually triggered for a specific branch. This workflow is configured for a single instance to be deployed in the `default` namespace of the cluster, which is used by all other namespaces (e.g., `prod`, `test`).

### NPM Package Development

Currently, there is an action for publishing a new version of the custom package. This needs to be done manually:

1. Package is updated.
2. Version of package is increased: `npm version patch|major|minor`
3. Changes are committed & pushed.
4. The Github publish action can now be manually triggered for the specified branch.

## Repository Setup

### Large File Storage

Setting up the code repository is rather straightforward expect for one thing: Large File Storage. Due to the large AI model files included in the project (multiple GBs), Git LFS must be enabled for the repository and installed locally before being able to push and pull code.

Additionally, it is important to include caching in the CI/CD workflows when checking out code or else workflows will be extremely resource intensive. If re-using the existing Github Action workflows, this is already configured.

### NPM Package

It’s best to publish the custom NPM packages to the same account. Once done, `.npmrc` files should be updated with the new URL and token, and the custom packages should be re-installed from the new location.

### Secrets

Assuming the existing Github Actions and the usage of Digital Ocean are re-used, the following secrets should be defined to be able to deploy to different environments:

**Built time**

- `CLUSTER_NAME` - name of the created kubernetes cluster.
- `CONTAINER_REGISTRY` - URL to the remote container registry.
- `DIGITALOCEAN_ACCESS_TOKEN` - Read & Write access token for the cluster.
- `NPM_TOKEN` - Read token for the NPM Packages.
- `SSL_SECRET_NAME` - Name of the stored SSL secret.

**Run time**

- `COOKIE_OPTION_SECRET_KEY_PROD`
- `COOKIE_OPTION_SECRET_KEY_TEST`
- `JWT_OPTION_TOKEN_PROD`
- `JWT_OPTION_TOKEN_TEST`

Examples and additional descriptions can be found in the `dev` config definition, the actions, and the Skaffold template.

If not using Digital Ocean, the actions need to be updated and most of the Built time secrets noted here won’t be relevant.

## Local Development Setup

### Technologies

To start developing, install the following technologies locally. The included versions are the latest verified versions to work, but it's advised to update these at some point.

- `Docker Desktop` - [v4.20.1](https://docs.docker.com/desktop/release-notes/#4201)
- `Kubectl` - [v1.25.9](https://git.k8s.io/kubernetes/CHANGELOG/CHANGELOG-1.25.md#v1259)
- `Minikube` - [v1.30.1](https://github.com/kubernetes/minikube/releases/tag/v1.30.1)
  - `Minikube Ingress Addon` - `minikube addons enable ingress`
- `Skaffold` - [v2.3.1](https://github.com/GoogleContainerTools/skaffold/releases/tag/v2.3.1)
- `Kustomize` - [v4.5.5](https://github.com/kubernetes-sigs/kustomize/releases/tag/kustomize%2Fv4.5.5)
- `Git LFS` - [v3.3.0](https://github.com/git-lfs/git-lfs/releases/tag/v3.3.0)
- `Node` - [v16](https://nodejs.org/en/blog/release/v16.16.0)
- `Python` - [v3.10](https://www.python.org/downloads/release/python-3100/)

### Built Time Configuration

Built time variables can be stored locally or added to the local `skaffold.env` file:

- `NPM_TOKEN` - a read-only token to the custom packages.
- `SKAFFOLD_DEFAULT_REPO` → If not building the local project, the URL to the online container registry. As all code is present locally, this is optional. If doing this, access to the registry will also need to be set up for the device.

### Workspace

It’s highly recommended to use VSCode as IDE. A workspace configuration file is included in the project. If opening this configuration file in VSCode, it will automatically setup up extensions and settings like linting, import optimization, etc.

### Running the Project

As described, Skaffold and Minikube are used to deploy the project locally. To do so, set the Kubernetes context to `minikube` and run the following commands:

- `minikube start` - starts the minikube container.
- `minikube tunnel` - opens a tunnel to the container to make it available on `localhost`. For this to work properly, the `ingress` addon needs to be enabled.
- `skaffold dev` - runs the `dev` Skaffold profile.

It should be noted that the first run will take a very long time due to the large amount of dependencies of the sentiment AI project that need to be downloaded.

### Accessing the Database

The `dev` configuration includes a local MongoDB instance in the cluster. As part of the `dev` profile, Skaffold opens a tunnel to `mongodb://localhost:27017`, where the database can be accessed through, for example, MongoDBCompass.

## Server Setup

### Digital Ocean

Throughout the project, mainly Digital Ocean has been used. Therefore, these instructions and much of the infrastrucutre configuration (e.g., managing SSL) are aimed at Digital Ocean.

Setting up a Kubernetes cluster is rather straightforward (as described here: [Kubernetes How-Tos :: DigitalOcean Documentation](https://docs.digitalocean.com/products/kubernetes/how-to/)):

1. Create a new kubernetes cluster on Digital Ocean (which offers $200 free credit for first 2 months).
2. Connect local machine to the Cluster.
3. Install a NGINX Ingress Controller (see their 1-click app: [NGINX Ingress Controller | DigitalOcean Marketplace 1-Click App](https://marketplace.digitalocean.com/apps/nginx-ingress-controller)).
4. Install a Cert-Manager (see their 1-click app: [Cert-Manager | DigitalOcean Marketplace 1-Click App](https://marketplace.digitalocean.com/apps/cert-manager)).
5. Get a domain.
6. Re-configure the `certificate.yaml` and `issuer.yaml` files in the `infra/setup` directory to use the domain.
7. Apply the YAML files to the cluster: `kubectl apply -f ...`
8. Create a `prod` namespace in the cluster: `kubectl create namespace prod`
9. Once the certificate is ready (see `kubectl get certificate`), an ssl secret is created with the name specified in the `certificate.yaml`. Copy this secret from the `default`to the `prod` namespace: `./move_secret.bat`
10. Re-configure the different `kustomization.yaml` and Ingress files in `infra/overlays`with the new secret name and domain name.
11. Point the domain name to the cluster. This can be done in the `networking` tab on digital ocean. Exact instructions on how to point the domain name to digitalocean will depend on the provider.

### Azure

Azure has only been added as server later on in the project, and does not yet include configuring a domain name and SSL.

1. Authenticate Azure CLI:

   ```powershell
   az login
   ```

2. Create a resource group:

   ```powershell
   az group create --name %RESOURCE_GROUP% --location %LOCATION%
   ```

3. Create a container registry. It's recommended to at least use the `Basic` option, as the 10GB size won't be enough to store the AI models.

   ```powershell
   az acr create --resource-group %RESOURCE_GROUP% --name %CONTAINER_REGISTRY% --sku Basic
   ```

4. Using the container registry, create a Kubernetes cluster. It's important to include the `-attach-acr` flag here, as it configures the cluster to have access to the created images. To do this, you'll need to have the `Owner`, `Azure account administrator`, or `Azure co-administrator` role in the resource group.

   ```powershell
   az aks create \
       --resource-group %RESOURCE_GROUP% \
       --name %CLUSTER% \
       --node-count 2 \
       --generate-ssh-keys \
       --attach-acr %CONTAINER_REGISTRY%
   ```

5. Add the cluster to your device:

   ```powershell
   az aks get-credentials --resource-group %RESOURCE_GROUP% --name %CLUSTER%
   ```

6. Add an NGINX Ingress Controller to the cluster:

   ```powershell
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.0/deploy/static/provider/cloud/deploy.yaml
   ```

7. To push images, log in to the registry. This gives you a login token to access the registry for 3 hours, after which you'll need to re-authenticate.

   ```powershell
   az acr login --name %CONTAINER_REGISTRY%
   ```

8. Some other useful commands: Get the connection URL for the registry (which should be the value of `SKAFFOLD_DEFAULT_REPO` in the `skaffold.env` file from where the app is being deployed):

   ```powershell
   az acr list --resource-group %RESOURCE_GROUP% --query "[].{acrLoginServer:loginServer}" --output table
   ```

   List the stored containers:

   ```powershell
   az acr repository list --name %REOURCE_GROUP% --output table
   ```

## Known Issues

The following problems are known at the end of the project and should be taken into considerations when picking up the project:

- Session cookie is not stored securely.
- No user roles (admin & regular users) and access control. For example, a regular user should not have access to the admin dashboard, and a user should only be able to access messages from campaigns they are added to.
- Production does not use permanent, backed up data storage.
- Logging out does not invalidate the JWT (example approach: keep a Redis storage with invalidated tokens that all services can access when validating a token).
- Input validation for websocket messages.
- No TypeScript in the frontend project.
- When an account gets deleted, related data does not get deleted.
- No environmental specific start commands for projects (e.g., using `ts-node-dev` in `prod`).
- Frontend component and CSS stylesheet architecture/usage is a mess.
