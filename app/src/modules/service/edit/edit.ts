import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Rx';
import {MindsTitle} from '../../../services/ux/title';
import {ACCESS, LICENSES, REASONS, SERVICE_OWNER} from '../../../services/list-options';
import {Client, Upload} from '../../../services/api';
import {SessionFactory} from '../../../services/session';

@Component({
    moduleId: module.id,
    selector: 'afs-service-edit',
    host: {
        'class': 'm-service'
    },
    templateUrl: 'edit.html'
})

export class ServiceEdit {
    optionsModel: number[];
    minds = window.Afs;
    session = SessionFactory.build();
    dragging = true;
    isChecked: number = 1;
    serviceOwner = SERVICE_OWNER;
    uploads: Array<any> = [];
    guid: string;
    service: any = {
        guid: 'new',
        owner: this.isChecked,
        title: '',
        description: '',
        time_created: Date.now(),
        access_id: 2,
        category: '',
        categories: [],
        pictures: [],
        license: 'attribution-sharealike-cc',
        fileKey: 'header',
        mature: 0,
        latitude: '',
        longitude: '',
        monetized: 0,
        published: 0,
        wire_threshold: null,
        custom_meta: {
            title: '',
            description: '',
            author: ''
        },
        slug: ''
    };
    banner: any;
    banner_top: number = 0;
    banner_prompt: boolean = false;
    editing: boolean = true;
    canSave: boolean = true;
    inProgress: boolean = false;
    validThreshold: boolean = true;
    error: string = '';
    pendingUploads: string[] = [];

    categories: { id, label, slag, level, selected }[];

    licenses = LICENSES;
    access = ACCESS;
    paramsSubscription: Subscription;
    //@ViewChild('inlineEditor') inlineEditor: InlineEditorComponent;
    //@ViewChild('thresholdInput') thresholdInput: WireThresholdInputComponent;

    constructor(public client: Client, public _upload: Upload, public router: Router, public route: ActivatedRoute, public title: MindsTitle) {
        this.getCategories();

        window.addEventListener('attachment-preview-loaded', (event: CustomEvent) => {
            this.pendingUploads.push(event.detail.timestamp);
        });
        window.addEventListener('attachment-upload-finished', (event: CustomEvent) => {
            this.pendingUploads.splice(this.pendingUploads.findIndex((value) => {
                return value === event.detail.timestamp;
            }), 1);
        });
    }

    ngOnInit() {
        if (!this.session.isLoggedIn()) {
            this.router.navigate(['/login']);
            return;
        }

        let node = document.createElement('script');
        node.src = "js/select2/select.fun.js";
        document.getElementsByTagName('head')[0].appendChild(node);


        let leaflet = document.createElement('script');
        leaflet.src = window.Afs.site_url + "js/map/leaflet.js";
        document.getElementsByTagName('head')[0].appendChild(leaflet);


        let leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.type = 'text/css';
        leafletCSS.href = window.Afs.site_url + "js/map/leaflet.css";
        leafletCSS.media = 'all';
        document.getElementsByTagName('head')[0].appendChild(leafletCSS);


        let addMarker = document.createElement('script');
        addMarker.src = window.Afs.site_url + "js/map/addMarker.js";
        document.getElementsByTagName('head')[0].appendChild(addMarker);


        /*
                if ( !this.session.isPublic() )
                {
                    alert("متاسفانه امکان ثبت سرویس برای کاربرانی که پروفایل خود را عمومی نکرده اند وجود ندارد . ");
                    this.router.navigate(['/monetization']);
                    return;
                }
        */
        this.title.setTitle('کسب و کار جدید');

        this.paramsSubscription = this.route.params.subscribe(params => {
            if (params['guid']) {
                this.guid = params['guid'];

                this.service = {
                    guid: 'new',
                    owner: this.isChecked,
                    title: '',
                    description: '',
                    access_id: 2,
                    categories: [],
                    pictures: [],
                    license: '',
                    fileKey: 'header',
                    mature: 0,
                    monetized: 0,
                    published: 0,
                    wire_threshold: null,
                    phone: '',
                    mobile: '',
                    address: '',
                    instagram: '',
                    telegram: '',
                    website: '',
                    latitude: '',
                    longitude: '',
                    custom_meta: {
                        title: '',
                        description: '',
                        author: ''
                    },
                    slug: ''
                };

                this.banner = void 0;
                this.banner_top = 0;
                this.banner_prompt = false;
                this.editing = true;
                this.canSave = true;
                if (this.guid !== 'new') {
                    this.load();
                }
            }
        });
    }

    ngOnDestroy() {
        if (this.paramsSubscription) {
            this.paramsSubscription.unsubscribe();
        }
    }

    getCategories() {
        this.categories = [];

        for (let cat in window.Afs.categories) {
            this.categories.push({
                id: Number(window.Afs.categories[cat].code),
                label: window.Afs.categories[cat].title,
                level: window.Afs.categories[cat].level,
                slag: window.Afs.categories[cat].slag,
                selected: false
            });
        }

        this.categories.sort((a, b) => a.id > b.id ? 1 : -1);
    }

    load() {
        this.client.get('api/v1/service/' + this.guid, {})
            .then((response: any) => {
                if (response.service) {
                    this.service = response.service;
                    this.guid = response.service.guid;
                    this.isChecked = this.service.owner;
                    this.title.setTitle(this.service.title);

                    if (this.service.owner == 1) {
                        (document.getElementById("service-owner-1") as HTMLInputElement).checked = true;
                    }
                    else if (parseInt(this.service.owner) == 2) {
                        (document.getElementById("service-owner-2") as HTMLInputElement).checked = true;
                    }
                    // draft
                    if (!this.service.published && response.service.draft_access_id) {
                        this.service.access_id = response.service.draft_access_id;
                    }

                    if (!this.service.category)
                        this.service.category = '';

                    if (!this.service.license)
                        this.service.license = '';

                    let drawMap = document.createElement('script');
                    var calling = document.createTextNode("drawMap(" + Number(this.service.latitude) + "," + Number(this.service.longitude) + ");");
                    drawMap.appendChild(calling);
                    document.body.appendChild(drawMap);

                    let select2 = document.createElement('script');
                    var calling2 = document.createTextNode("$('.select2').select2();");
                    select2.appendChild(calling2);
                    document.body.appendChild(select2);


                }
            });
    }

    onChange(category) {
        /*
        category.selected = !category.selected;
        if (!this.service.hasOwnProperty('categories') || !this.service.categories) {
            this.service['categories'] = [];
        }

        if (category.selected) {
            this.service.categories.push(category.id);
        } else {
            this.service.categories.splice(this.service.categories.indexOf(category.id), 1);
        }
        */
    }

    save() {
        if (!this.canSave)
            return;

        const service = Object.assign({}, this.service);

        let selectedCat = Array.prototype.slice.call(document.querySelectorAll('#categories option:checked'), 0).map(function (v, i, a) {
            return v.value;
        });

        service.latitude = (document.getElementById("latitude")as HTMLInputElement).value;
        service.longitude = (document.getElementById("longitude")as HTMLInputElement).value;

        this.service.latitude = service.latitude;
        this.service.longitude = service.longitude;

        service.categories = selectedCat;
        this.service.categories = selectedCat;

        service.mature = service.mature ? 1 : 0;
        service.monetization = service.monetization ? 1 : 0;
        service.monetized = service.monetized ? 1 : 0;
        this.inProgress = true;
        this.canSave = false;

        this.service.pictures = this.uploads.map((upload) => {
            if (upload.guid !== null || upload.guid !== 'null' || !upload.guid)
                return upload.guid;
        });

        this.check_for_banner().then(() => {
            this._upload.post('api/v1/service/' + this.guid, [this.banner], service)
                .then((response: any) => {
                    this.router.navigate(response.route ? ['/' + response.route] : ['/service/view', response.guid]);
                    this.canSave = true;
                    this.inProgress = false;
                })
                .catch((e) => {
                    this.canSave = true;
                    this.inProgress = false;
                });
        })
            .catch(() => {
                this.client.post('api/v1/service/' + this.guid, this.service)
                    .then((response: any) => {
                        if (response.guid) {
                            this.router.navigate(response.route ? ['/' + response.route] : ['/service/view', response.guid]);
                        }
                        this.inProgress = false;
                        this.canSave = true;
                    })
                    .catch((e) => {
                        this.inProgress = false;
                        this.canSave = true;
                    });
            });


    }

    add_banner(banner: any) {
        var self = this;
        this.banner = banner.file;
        this.service.header_top = banner.top;
    }

    //this is a nasty hack because people don't want to click save on a banner ;@
    check_for_banner() {
        if (!this.banner)
            this.banner_prompt = true;

        return new Promise((resolve, reject) => {
            if (this.banner)
                return resolve(true);
            setTimeout(() => {
                if (this.banner)
                    return resolve(true);
                else
                    return reject(false);
            }, 100);
        });
    }

    toggleMonetized() {
        if (this.service.mature) {
            return;
        }
        this.service.monetized = this.service.monetized ? 0 : 1;
    }

    checkMonetized() {
        if (this.service.mature) {
            this.service.monetized = 0;
        }
    }


    /**
     * Add a file to the upload queue
     */
    add(file: any) {
        var self = this;

        for (var i = 0; i < file.files.length; i++) {

            var data: any = {
                guid: null,
                state: 'created',
                progress: 0,
                category: 0
            };

            var fileInfo = file.files[i];

            if (fileInfo.type && fileInfo.type.indexOf('image') > -1) {
                data.type = 'image';
            } else if (fileInfo.type && fileInfo.type.indexOf('video') > -1) {
                data.type = 'video';
            } else {
                continue;
            }
            data.name = fileInfo.name;
            data.title = data.name;
            var upload_i = this.uploads.push(data) - 1;
            this.uploads[upload_i].index = upload_i;
            this.upload(this.uploads[upload_i], fileInfo);
        }
    }

    upload(data, fileInfo) {
        var self = this;
        this._upload.post('api/v1/media', [fileInfo], this.uploads[data.index], (progress) => {
            self.uploads[data.index].progress = progress;
            if (progress === 100) {
                self.uploads[data.index].state = 'uploaded';
            }
        })
            .then((response: any) => {
                self.uploads[data.index].guid = response.guid;
                self.uploads[data.index].state = 'complete';
                self.uploads[data.index].progress = 100;
            })
            .catch(function (e) {
                self.uploads[data.index].state = 'failed';
                alert(e.message);
            });
    }

    modify(index) {
        this.uploads[index].state = 'uploaded';
        //we don't always have a guid ready, so keep checking for one
        var promise = new Promise((resolve, reject) => {
            if (this.uploads[index].guid) {
                setTimeout(() => {
                    resolve();
                }, 300);
                return;
            }
            var interval = setInterval(() => {
                if (this.uploads[index].guid) {
                    resolve();
                    clearInterval(interval);
                }
            }, 1000);
        });
        promise.then(() => {
            this.client.post('api/v1/media/' + this.uploads[index].guid, this.uploads[index])
                .then((response: any) => {

                    this.uploads[index].state = 'complete';
                });
        });
    }

    /**
     * Publish our uploads to an album

     publish() {
    if (!this.postMeta.album_guid)
      return alert('برای ذخیره سازی باید یک آلبوم را انتخاب کنید');
    var self = this;
    var guids = this.uploads.map((upload) => {
      if (upload.guid !== null || upload.guid !== 'null' || !upload.guid)
        return upload.guid;
    });
    this.client.post('api/v1/media/albums/' + this.postMeta.album_guid, { guids: guids })
      .then((response: any) => {
        self.router.navigate(['/media', this.postMeta.album_guid]);
      })
      .catch((e) => {
        alert('there was a problem.');
      });
  }
     */
    /**
     * Make sure the browser doesn't freak
     */
    dragover(e) {
        e.preventDefault();
        this.dragging = true;
    }

    /**
     * Tell the app we have stopped dragging
     */
    dragleave(e) {
        e.preventDefault();

        if (e.layerX < 0)
            this.dragging = false;
    }

    drop(e) {
        e.preventDefault();
        this.dragging = false;
        this.add(e.dataTransfer);
    }

    onSelectionChange(item) {
        this.service.owner = item;
    }
}