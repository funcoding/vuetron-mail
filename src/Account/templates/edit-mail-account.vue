<form id = "form" style = "margin: 10px;" v-on:submit.prevent="submitForm()">
    <div class="form-group">
        <label>Name</label>
        <input  type="text" class="form-control" placeholder="John Doe" v-model="name">
    </div>

    <div class="form-group">
        <label>Email address</label>
        <input  type="email" class="form-control" placeholder="Email" v-model="email">
    </div>

    <div class="form-group">
        <label>Password</label>
        <input  type="password" class="form-control" placeholder="" v-model="password">
    </div>

    <div class="form-group">
        <label>Incoming server type</label>
        <div class="radio">
            <label>
                <input type="radio" name="server-type" checked="checked" value="imap" v-model="incoming_server_type">
                IMAP
            </label>
        </div>
        <!--<div class="radio">
            <label>
                <input type="radio" name="server-type" value = "pop3" v-model="incoming_server_type">
                POP3
            </label>
        </div>-->
    </div>

    <div class="form-group">
        <label>Incoming Server Hostname</label>
        <input  type="text" class="form-control" placeholder="example.smtp.com" v-model="incoming_server_hostname">
    </div>

    <div class="form-group">
        <label>Incoming Server Port</label>
        <input  type="text" class="form-control" placeholder="456" v-model.number="incoming_server_port">
    </div>

    <div class="form-group">
        <label>SSL</label>
        <select class="form-control" v-model="incoming_server_ssl">
            <option>None</option>
            <option>SSL/TLS</option>
        </select>
    </div>

    <div class="form-group">
        <label>Authentication</label>
        <select class="form-control" v-model="incoming_server_authentication">
            <option>No authentication</option>
            <option>Normal password</option>
        </select>
    </div>

    <div class="form-group">
        <label>Outgoing Server Hostname</label>
        <input  type="text" class="form-control" placeholder="example.imap.com" v-model="outgoing_server_hostname">
    </div>

    <div class="form-group">
        <label>Outgoing Server Port</label>
        <input  type="text" class="form-control" placeholder="456" v-model.number="outgoing_server_port">
    </div>

    <div class="form-group">
        <label>SSL</label>
        <select class="form-control" v-model="outgoing_server_ssl">
            <option>None</option>
            <option>SSL/TLS</option>
        </select>
    </div>

    <div class="form-group">
        <label>Authentication</label>
        <select class="form-control" v-model="outgoing_server_authentication">
            <option>No authentication</option>
            <option>Normal password</option>
        </select>
    </div>

    <div class="form-group">
        <label>Sync Duration (In minutes)</label>
        <select class="form-control" v-model="sync_duration">
        </select>
    </div>

    <info v-show="display" v-bind:message="message"></info>

    <div class="form-actions">
        <button  type = "submit"  id = "update-mail-account-btn" class="btn btn-form btn-primary">
            Update
        </button>
    </div>
</form>