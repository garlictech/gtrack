import * as sst from '@serverless-stack/resources';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { StackProps } from '@aws-cdk/core';
import { SecretsManagerStack } from './secretsmanager-stack';

export interface PipelineStackProps extends StackProps {
  readonly repoName: string;
  readonly repoOwner: string;
  readonly repoBranch: string;
  readonly secretsManager: SecretsManagerStack;
}

export class PipelineStack extends sst.Stack {
  constructor(app: sst.App, id: string, props: PipelineStackProps) {
    super(app, id, props);

    const buildOutput = new codepipeline.Artifact('BuildOutput');
    const sourceOutput = new codepipeline.Artifact('SourceOutput');

    const build = new codebuild.PipelineProject(this, 'build', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: ['yarn']
          },
          build: {
            commands: [
              'yarn nx run-many --target build --projects admin,infrastructure-gtrack-stack'
            ]
            //commands: ['yarn nx affected:build --parallel --maxParallel=2']
          }
        },
        artifacts: {
          files: [
            'apps/infrastructure/gtrack-stack/.serverless',
            'node_modules/**/*'
          ]
        }
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3
      }
    });

    const deploy = new codebuild.PipelineProject(this, 'DeployBuild', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: ['yarn']
          },
          build: {
            commands: ['cd apps/infrastructure', 'yarn sst deploy']
          }
        },
        artifacts: {
          files: ['dist/apps/admin/**/*']
        }
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3
      }
    });

    new codepipeline.Pipeline(this, 'Pipeline', {
      stages: [
        {
          stageName: 'CloneSource',
          actions: [
            new codepipeline_actions.GitHubSourceAction({
              actionName: 'CodeCommit_CloneSource',
              oauthToken: props.secretsManager.githubOauthToken.secretValue,
              output: sourceOutput,
              owner: props.repoOwner,
              repo: props.repoName,
              branch: props.repoBranch
            })
          ]
        },
        {
          stageName: 'Build',
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: 'Build',
              project: build,
              input: sourceOutput,
              outputs: [buildOutput]
            })
          ]
        },
        {
          stageName: 'Deploy',
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: 'Deploy',
              project: deploy,
              input: buildOutput
            })
          ]
        }
      ]
    });

    new codebuild.GitHubSourceCredentials(this, 'CodeBuildGitHubCreds', {
      accessToken: props.secretsManager.githubOauthToken.secretValue
    });

    const githubPrSource = codebuild.Source.gitHub({
      owner: props.repoOwner,
      repo: props.repoName,
      webhook: true,
      webhookFilters: [
        codebuild.FilterGroup.inEventOf(
          codebuild.EventAction.PULL_REQUEST_CREATED
        ),
        codebuild.FilterGroup.inEventOf(
          codebuild.EventAction.PULL_REQUEST_UPDATED
        )
      ]
    });

    new codebuild.Project(this, 'PullRequestClone', {
      source: githubPrSource,
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: ['yarn']
          },
          build: {
            commands: [
              'yarn nx affected:lint --base=staging',
              'yarn nx affected:test --base=staging',
              'yarn nx affected:build --base=staging'
            ]
          }
        }
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3
      }
    });
  }
}
