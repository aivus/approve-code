$(function(){
    $(".repos").bootstrapSwitch({
        size: 'mini',
        onSwitchChange: onSwitchChange
    });

    function onSwitchChange(event, state) {
        $.post('/repos/' + this.value + '/state', {state: state});
    }
});
