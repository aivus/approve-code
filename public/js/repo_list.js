$(function () {
    $('.repos').bootstrapSwitch({
        size: 'mini',
        onSwitchChange: toggleRepoState
    });

    function toggleRepoState(event, state) {
        $.post('/repos/' + this.value + '/process/' + (state ? 'enable' : 'disable'));
    }
});
