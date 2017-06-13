<div>
    <div>
        <button v-bind:disabled="disabled" v-on:click="syncFolder()" class="btn btn-primary btn-large pull-right" style="margin:10px;">
            <span class="icon icon-arrows-ccw"></span>&nbsp;&nbsp{{ sync }}
        </button>

        <table class="table-striped">
            <thead>
            <tr>
                <th v-show='$route.params.folder !== "Sent"'>From</th>
                <th v-show='$route.params.folder === "Sent"'>To</th>
                <th>Subject</th>
                <th>Date</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="content in contents">
                <td v-show='$route.params.folder !== "Sent"'>{{ JSON.parse(content.headers).from[0] }}</td>
                <td v-show='$route.params.folder === "Sent"'>{{ JSON.parse(content.headers).to[0] }}</td>
                <td>{{ JSON.parse(content.headers).subject[0] }}</td>
                <td>{{ JSON.parse(content.headers).date[0] }}</td>
                <td>
                    <router-link v-bind:to="{ name: 'open-mail', params: { id: content.mail_account_id, folder: content.folder, sequence_number: content.sequence_number }}">
                       <button class="btn btn-positive btn-large">
                           Open
                       </button>
                    </router-link>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</div>