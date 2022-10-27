# requisite-ui

### Compiles and hot-reloads for development
```
npm run serve
```
If receiving the following error on serve: `ENOSPC: System limit for number of file watchers reached`, try running the following commands:
```
npm dedupe
```
If that doesn't resolve the issue, then:
```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
sudo sysctl --system
```

If running into an install issue with Vue and npm 7.5 about not being able to resolve the dependency tree due to a not found peer dependency, run npm install with the legacy peer flag:
```
npm install --legacy-peer-deps
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
