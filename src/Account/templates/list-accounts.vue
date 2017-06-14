<ul class="list-group">
    <!--<li class="list-group-header">
        <input class="form-control" type="text" placeholder="Search for someone">
    </li>-->
    <li class="list-group-item" v-for="account in accounts">
        <div class="media-body">
            <div>
                <strong>{{ account.email }}</strong>
                <div class="pull-right">
                    <button class="btn btn-default btn-dropdown" v-on:click="expandMenu(account.id)">
                        <span class="icon icon-tools"></span>
                    </button>
                    <div style="display: none;" v-bind:id="'dropdown-'+account.id">
                        <router-link class="nav-group-item" v-bind:to="{ name: 'edit-mail-account', params: { id: account.id }}">
                            Edit
                        </router-link>
                        <div class="" v-on:click="removeAccount(account.id)">Remove</div>
                    </div>
                </div>
                <nav class="nav-group pull-left">
                    <btn class="nav-group-item" v-on:click="compose(account.id)"><span class="icon icon-pencil"></span>Compose</btn>
                    <router-link v-bind:class = "$route.params.folder === 'INBOX' && account.id === $route.params.id ? 'nav-group-item active' : 'nav-group-item'" v-bind:to="{ name: 'folder-navigation', params: { id: account.id, folder: 'INBOX' }}">
                        <span class="icon icon-mail"></span>
                        Inbox
                    </router-link>

                    <!--<router-link class="nav-group-item" v-bind:to="{ name: 'folder-navigation', params: { id: account.id, folder: 'outbox' }}">
                        <span class="icon icon-logout"></span>
                        Outbox
                    </router-link>-->

                    <router-link v-bind:class = "$route.params.folder === 'Sent' && account.id === $route.params.id ? 'nav-group-item active' : 'nav-group-item'" v-bind:to="{ name: 'folder-navigation', params: { id: account.id, folder: 'Sent' }}">
                        <span class="icon icon-paper-plane" ></span>
                        Sent
                    </router-link>

                    <router-link v-bind:class = "$route.params.folder === 'Spam' && account.id === $route.params.id ? 'nav-group-item active' : 'nav-group-item'"  v-bind:to="{ name: 'folder-navigation', params: { id: account.id, folder: 'Spam' }}">
                        <span class="icon icon-alert"></span>
                        Spam
                    </router-link>
                </nav>
            </div>
        </div>
    </li>
</ul>