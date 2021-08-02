import { App } from '@serverless-stack/resources';
import { PipelineStack } from './build-pipeline/pipeline-stack';
import { SecretsManagerStack } from './build-pipeline/secretsmanager-stack';

export default function main(app: App): void {
  const secretsManagerStack = new SecretsManagerStack(app, 'secretsmanager');

  new PipelineStack(app, 'PipelineStack', {
    repoOwner: 'garlictech',
    repoName: 'gtrack',
    repoBranch: 'code-pipeline',
    secretsManager: secretsManagerStack
  });
}
