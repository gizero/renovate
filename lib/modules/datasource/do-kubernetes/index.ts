import { logger } from '../../../logger';
import { cache } from '../../../util/cache/package/decorator';
import type { HttpResponse } from '../../../util/http/types';
import { Datasource } from '../datasource';
import type { GetReleasesConfig, Release, ReleaseResult } from '../types';
import type { DoKubernetesOptionsResult } from './types';

export class DoKubernetesDataSource extends Datasource {
  static readonly id = 'do-kubernetes';

  override readonly caching = true;

  constructor() {
    super(DoKubernetesDataSource.id);
  }

  @cache({
    namespace: `datasource-${DoKubernetesDataSource.id}`,
    key: ({ packageName }: GetReleasesConfig) => `getReleases:${packageName}`,
  })
  async getReleases({
    packageName,
  }: GetReleasesConfig): Promise<ReleaseResult | null> {
    const url = 'https://api.digitalocean.com/v2/kubernetes/options';

    let response: HttpResponse<DoKubernetesOptionsResult> | null = null;
    try {
      response = await this.http.getJson<DoKubernetesOptionsResult>(url, {
        token: process.env.DO_TOKEN,
      });
    } catch (err) {
      this.handleGenericErrors(err);
    }

    const body = response?.body;

    if (!body) {
      logger.warn(
        { dependency: packageName },
        `Received invalid data from ${url}`
      );
      return null;
    }

    const versions = response.body.options.versions ?? [];
    return {
      releases: versions.map((version) => {
        const release: Release = {
          version: version.kubernetes_version,
        };

        return release;
      }),
    };
  }
}
