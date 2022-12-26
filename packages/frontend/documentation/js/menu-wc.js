'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">video-call documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-1ee67ef9cfa0979f639ab5b407171e28ce8b9e2f9ef3fabf835f71033a1c7b631378895a867d68bfaf423d0f76b4951cd6d68fa62d8aaf46afebe551501e92a8"' : 'data-target="#xs-components-links-module-AppModule-1ee67ef9cfa0979f639ab5b407171e28ce8b9e2f9ef3fabf835f71033a1c7b631378895a867d68bfaf423d0f76b4951cd6d68fa62d8aaf46afebe551501e92a8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-1ee67ef9cfa0979f639ab5b407171e28ce8b9e2f9ef3fabf835f71033a1c7b631378895a867d68bfaf423d0f76b4951cd6d68fa62d8aaf46afebe551501e92a8"' :
                                            'id="xs-components-links-module-AppModule-1ee67ef9cfa0979f639ab5b407171e28ce8b9e2f9ef3fabf835f71033a1c7b631378895a867d68bfaf423d0f76b4951cd6d68fa62d8aaf46afebe551501e92a8"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ButtonComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ButtonComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoggerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoggerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PushNotificationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PushNotificationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SearchEngineComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SearchEngineComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VideoCallComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VideoCallComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VideoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VideoComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-AppModule-1ee67ef9cfa0979f639ab5b407171e28ce8b9e2f9ef3fabf835f71033a1c7b631378895a867d68bfaf423d0f76b4951cd6d68fa62d8aaf46afebe551501e92a8"' : 'data-target="#xs-pipes-links-module-AppModule-1ee67ef9cfa0979f639ab5b407171e28ce8b9e2f9ef3fabf835f71033a1c7b631378895a867d68bfaf423d0f76b4951cd6d68fa62d8aaf46afebe551501e92a8"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-AppModule-1ee67ef9cfa0979f639ab5b407171e28ce8b9e2f9ef3fabf835f71033a1c7b631378895a867d68bfaf423d0f76b4951cd6d68fa62d8aaf46afebe551501e92a8"' :
                                            'id="xs-pipes-links-module-AppModule-1ee67ef9cfa0979f639ab5b407171e28ce8b9e2f9ef3fabf835f71033a1c7b631378895a867d68bfaf423d0f76b4951cd6d68fa62d8aaf46afebe551501e92a8"' }>
                                            <li class="link">
                                                <a href="pipes/KeysPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >KeysPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/ButtonComponent.html" data-type="entity-link" >ButtonComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/GlobalStoreService.html" data-type="entity-link" >GlobalStoreService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoggerService.html" data-type="entity-link" >LoggerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MediaRecorderService.html" data-type="entity-link" >MediaRecorderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MediaStreamService.html" data-type="entity-link" >MediaStreamService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/P2pService.html" data-type="entity-link" >P2pService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PushNotificationService.html" data-type="entity-link" >PushNotificationService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/HandleListModel.html" data-type="entity-link" >HandleListModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IconsModel.html" data-type="entity-link" >IconsModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LogsModel.html" data-type="entity-link" >LogsModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MessageModel.html" data-type="entity-link" >MessageModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NotificationModel.html" data-type="entity-link" >NotificationModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RecordModel.html" data-type="entity-link" >RecordModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SearchEngineModel.html" data-type="entity-link" >SearchEngineModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StylesModel.html" data-type="entity-link" >StylesModel</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});