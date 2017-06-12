<div>
    <div style="margin:10px;">
        <button class="btn btn-large btn-positive" onClick="window.history.back()">Back</button>

        <button class="btn btn-default pull-right" v-on:click="openMessageWindow('forward')"><span class="icon icon-forward"></span>Forward</button>
        <button class="btn btn-default pull-right" v-on:click="openMessageWindow('reply-all')"><span class="icon icon-reply-all"></span>Reply all</button>
        <button class="btn btn-default pull-right" v-on:click="openMessageWindow('reply')"><span class="icon icon-reply"></span>Reply</button>
    </div>

    <div style = "margin:30px;" v-html="body"></div>

    <div style="margin: 30px;" v-if="attachments.length > 0">
        <span>Attachments:</span>
        <table>
            <thead>
                <tr>
                    <th>File Name:</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="file,key in attachments">
                    <td>
                        {{ file.filename }}
                        <button class="btn btn-default" v-on:click="downloadAttachment(key)">Save</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
