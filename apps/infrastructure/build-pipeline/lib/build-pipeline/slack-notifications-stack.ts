import * as chatbot from '@aws-cdk/aws-chatbot';
import * as sst from '@serverless-stack/resources';
import * as sns from '@aws-cdk/aws-sns';

export class SlackNotificationsStack extends sst.Stack {
  public chatbot: chatbot.SlackChannelConfiguration;

  constructor(app: sst.App, id: string) {
    super(app, id);

    const slackChannelSns = new sns.Topic(this, 'SlackNotificationTopic');

    this.chatbot = new chatbot.SlackChannelConfiguration(
      this,
      'PR build Slack notification channel',
      {
        slackChannelId: 'dev-notifications',
        slackWorkspaceId: 'T3HBVG04X',
        slackChannelConfigurationName: 'gTrackuild',
        notificationTopics: [slackChannelSns]
      }
    );
  }
}
