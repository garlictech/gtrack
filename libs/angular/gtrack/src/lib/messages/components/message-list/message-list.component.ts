import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GenericUiActions } from '@gtrack/shared/generic-ui/data-access';
import { CommentMessage } from '@bit/garlictech.angular.gtrack.gtrack-interfaces';
import { EntityAction } from '@ngrx/data';
import { Store } from '@ngrx/store';
import { Auth } from 'aws-amplify';
import { uniqueId } from 'lodash';
import { Observable } from 'rxjs';
import { MessageService } from '../../services/message.entity-service';

export class PoiMessageData {
  id: string;
  type: string;
  description?: any;
  user?: {
    id: string;
    name?: string;
  };
}

@Component({
  selector: 'gtrack-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('openClose', [
      // ...
      state(
        'open',
        style({
          opacity: '1',
          height: '*',
        })
      ),
      state(
        'closed',
        style({
          opacity: '0',
          height: '0',
        })
      ),
      transition('open => closed', [
        style({
          width: '*',
        }),
        animate('500ms cubic-bezier(0.35, 0, 0.25, 1)'),
      ]),
      transition('closed => open', [
        style({
          width: 0,
        }),
        animate('500ms cubic-bezier(0.35, 0, 0.25, 1)'),
      ]),
    ]),
  ],
})
export class MessageListComponent implements OnInit {
  messages$: Observable<CommentMessage[]>;
  count$: Observable<number>;
  loading$: Observable<boolean>;
  error$: Observable<EntityAction>;

  commentForm: FormGroup;
  messageFormOpened = false;

  messageData: PoiMessageData;

  constructor(
    private _route: ActivatedRoute,
    private _service: MessageService,
    private _formBuilder: FormBuilder,
    private _store: Store
  ) {
    // Can create a service instance like this, if you don't want inject the service
    // ---this._service = entityCollectionServiceFactory.create<CommentMessage>('CommentMessage');

    this.messages$ = this._service.entities$;
    this.count$ = this._service.count$;
    this.loading$ = this._service.loading$;
    this.error$ = this._service.errors$;

    this.commentForm = this._formBuilder.group({
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const data = JSON.parse(
      this._route.snapshot.queryParamMap.get('data') || undefined
    );

    // --- Initialize POI message data with the POI ID and POI TYPE (POI | HIKE | COORD)
    this.messageData = {
      id: this._route.snapshot.paramMap.get('id'),
      type: this._route.snapshot.paramMap.get('type'),
    };

    // --- If the comment message belongs to POI add description from POI data (to display it values on the screen)
    switch (this.messageData.type) {
      case 'HIKE':
      case 'POI':
        {
          this.messageData.description = data.description;
        }
        break;
      case 'COORD':
        {
          this.messageData.description =
            (data.lat.toFixed(2) || 0) +
            '\xB0 - ' +
            (data.lon.toFixed(2) || 0) +
            '\xB0';
        }
        break;
      default:
        break;
    }

    // --- Get current authanticated user's ID and NAME (if exists)
    Auth.currentAuthenticatedUser().then(user => {
      // --- Add user ID and name to the message data
      this.messageData.user = {
        id: user.attributes['sub'],
        name: user.attributes['name'],
      };
    });

    // --- Show loading indicator when store operations are pending
    this.loading$.subscribe((loading: boolean) => {
      this.showLoading(loading);
    });

    // ---CALL REST API TO GET ALL DATA FROM SERVER OR....
    this._service.getAll();

    // --- TODO put it back if the dataservice function completed.
    // this._service.getWithQuery({
    //   contextId: this.messageData.id,
    //   contextType: this.messageData.type
    // });

    // -- ....YOU CAN USE ACTIONS TOO
    // const action = this._entityActionFactory.create<CommentMessage>('CommentMessage', EntityOp.QUERY_ALL);
    // this._store.dispatch(action);
  }

  private showLoading(show: boolean) {
    const spinnerId = uniqueId();
    show
      ? this._store.dispatch(
          GenericUiActions.showProgressSpinner({ spinnerId })
        )
      : this._store.dispatch(
          GenericUiActions.hideProgressSpinner({ spinnerId })
        );
  }

  addComment(): void {
    const c: CommentMessage = {
      id: '' + new Date().getTime(),
      contextId: this.messageData.id,
      contextType: this.messageData.type as any,
      title: this.commentForm.value.title,
      body: this.commentForm.value.message,
      language: 'hu',
      userId: this.messageData.user.name,
      createdDate: new Date(),
      hidden: false,
      private: false,
    };
    this._service.add(c);
    this.commentForm.reset();
    this.messageFormOpened = false;
  }

  filterComments($event: CustomEvent): void {
    this._service.getWithQuery({
      contextType: $event.detail.value,
    });
  }

  openCloseMessageForm(): void {
    this.messageFormOpened = !this.messageFormOpened;
  }
}
