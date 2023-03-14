import { Component, EventEmitter} from '@angular/core';
import { Client } from '../../../services/api';

@Component({
    moduleId: module.id,
    selector: 'afs-admin-comments',
    templateUrl: 'comments.html',
    outputs: ['_delete: delete'],
})

export class AdminComments {

    comments: any[] = [];
    category: string = '';
    inProgress: boolean = false;
    moreData: boolean = true;
    _delete: EventEmitter<any> = new EventEmitter();

    constructor(public client: Client) {
    }

    ngOnInit() {
        this.loadComments();
    }

    loadComments() {
        this.comments = [];
        this.client.get(`api/v1/admin/comments`, {})
            .then((response: any) => {
                //@todo: refactor if pagination (offset) is implemented
                this.moreData = false;
                this.comments = response.entities;

                if (!response.entities) {
                    this.inProgress = false;
                    return;
                }
                console.log(response);
                //this.comments.push(response.entities);
            })
            .catch(e => {
                this.moreData = false;
                this.inProgress = false;
                console.log(e);

            });
    }
    read(comment:any)
    {
        if (!confirm('Do you want to marks as read this comment?\n\nThere\'s no UNDO.')) {
            return;
        }
        this.client.put('api/v1/admin/comments/' + comment.guid + '/' + comment.time_created  + '/' + comment.owner_guid)
            .then((response: any) => {
                this._delete.next(true);
                this.loadComments();
            });
    }
    delete(guid:any)
    {
        if (!confirm('Do you want to delete this comment?\n\nThere\'s no UNDO.')) {
            return;
        }
        this.client.delete('api/v1/comments/' + guid)
            .then((response: any) => {
                this._delete.next(true);
                this.loadComments();
            });
    }
}