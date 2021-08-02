import * as sst from '@serverless-stack/resources';
import * as sm from '@aws-cdk/aws-secretsmanager';

export class SecretsManagerStack extends sst.Stack {
  public githubOauthToken: sm.ISecret;

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    this.githubOauthToken = sm.Secret.fromSecretAttributes(
      this,
      'GithubOauthTokenSecret',
      {
        secretArn:
          'arn:aws:secretsmanager:us-east-1:697486207432:secret:gtrack-codepipeline-github-oauth-uLumQu'
      }
    );
  }
}
