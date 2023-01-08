<!-- prettier-ignore -->
!!! warning
    This datasource is experimental.
    Its syntax and behavior may change at any time!

This datasource returns the available [DigitalOcean Kubernetes](https://docs.digitalocean.com/reference/api/api-reference/#operation/kubernetes_list_options) versions via the DigitalOcean API.

The datasource requires DO_TOKEN environment variable to be set with valid DigitalOcean API token.

At the moment, this datasource has no "manager".
You have to use the regex manager for this.

**Usage Example**

Here's an example of using the regex manager:

```javascript
module.exports = {
  regexManagers: [
    {
      fileMatch: ['\\.tf$'],
      matchStrings: [
        'depName=(?<depName>.*?)\\sversion = "(?<currentValue>.*?)"',
      ],
      datasourceTemplate: 'do-kubernetes',
    },
  ],
};
```

Or as JSON:

```yaml
{
  'regexManagers':
    [
      {
        'fileMatch': ['\\.tf$'],
        'matchStrings':
          ["depName=(?<depName>.*?)\\sversion = \"(?<currentValue>.*?)\""],
        'datasourceTemplate': 'do-kubernetes',
      },
    ],
}
```

This would match Terraform files, and would recognize the following lines:

```hcl
resource "digitalocean_kubernetes_cluster" "foo" {
  name   = "foo"
  region = "nyc1"
  # renovate: depname=do-kubernetes
  version = "1.22.8-do.1"

  node_pool {
    name       = "worker-pool"
    size       = "s-2vcpu-2gb"
    node_count = 3

    taint {
      key    = "workloadKind"
      value  = "database"
      effect = "NoSchedule"
    }
  }
}
```
