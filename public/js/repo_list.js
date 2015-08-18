$(function () {
    $('.repos').bootstrapSwitch({
        size: 'mini',
        onSwitchChange: toggleRepoState
    });

    function toggleRepoState(event, state) {
        $.post('/repos/' + this.value + '/' + (state ? 'enable' : 'disable'));
    }
});
