import * as sst from '@serverless-stack/resources';
import { GtrackTable } from './gtrack-dynamodb-construct';

export class DynamoDBStack extends sst.Stack {
  public readonly poiTable: Table;
  public readonly hikeTable: Table;
  public readonly imageTable: Table;
  public readonly adminTable: Table;
  public readonly customerTable: Table;

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    this.poiTable = new GtrackTable(this, 'Poi', { isStreamed: true }).theTable;
    this.imageTable = new GtrackTable(this, 'Image', {
      isStreamed: true
    }).theTable;
    this.hikeTable = new GtrackTable(this, 'Hike', {
      isStreamed: true
    }).theTable;
    this.adminTable = new GtrackTable(this, 'Admin', {
      primaryKeyName: 'email'
    }).theTable;
    this.customerTable = new GtrackTable(this, 'Customer').theTable;
  }
}
