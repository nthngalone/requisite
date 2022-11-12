# Development Guide

## System Requirements
- A Linux-based development environment (such as Ubuntu)
- Node.js 16+
- Minikube
- Docker
- Helm

## Getting Started

- **Clone the repo**

```
git clone git@github.com:nthngalone/requisite.git
```

- **Create a `.env` file in the root of the repo**

> **Note**: Use `.env.sample` as a guide.

- **Install the dependencies**

```
npm install
```

- **Create and start the minikube cluster and enable required add-ons.**

```
minikube start
minikube addons list
minikube addons enable registry
minikube addons enable ingress
```

> **Tip**: Need to blow away your minikube cluster and start over?  Use `minikube delete`.

- **Create `/etc/hosts` entries for `requisite.local` and `requisite-dbadmin.local`.**

For example:
```
192.168.49.2    requisite.local
192.168.49.2    requisite-dbadmin.local
```

- **Run the pipeline**

```
npm run pipeline
```

> **Note**: This will require `sudo` for performing Docker builds.  You can either wait until Docker is invoked and type in your credentials or run the pipeline as sudo (`sudo npm run pipeline`) and enter your credentials at the beginning.  This is the preferred approach so that you don't have to wait several minutes into the pipeline for Docker to be invoked.  If `npm` is not on your sudo path, create a psudo alias on your path (`alias psudo="sudo env \"PATH=$PATH\""`) and use it instead (`psudo npm run pipeline`).

- **Try it out!**

Upon a successful pipeline run, access the site at <http://requisite.local>.