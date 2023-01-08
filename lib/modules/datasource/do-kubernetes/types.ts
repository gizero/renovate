export interface KubernetesVersion {
  kubernetes_version: string;
}

export interface DoKubernetesOptionsResult {
  options: {
    versions: KubernetesVersion[];
  };
}
