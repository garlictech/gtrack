import { Stack } from '@serverless-stack/resources';

export class ElasticSearchStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);
    const app = this.node.root as App;
  }
}
