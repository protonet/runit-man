/*jslint browser: true, forin: true */
(function($, window)
{
    "use strict";
    var REFRESH_SERVICES_TIMEOUT = 5000;
    var REFRESH_SERVICES_URL     = $('body').data('servicesUrl');

    $.ajaxSetup({
        error: function(e, req, options, error)
        {
            $('#url').text(options.url);
            $('#error').show();
        }
    });

    var needRefreshServices, refreshServices;
    refreshServices = function()
    {
        refreshServices.timer = null;
        $.ajax({
            url: REFRESH_SERVICES_URL,
            cache: false
        }).fail(function()
        {
            $('#url').text(REFRESH_SERVICES_URL);
            $('#error').show();
        }).done(function(html)
        {
            $('#error').hide();
            $('#services').html(html);
        }).always(function()
        {
            needRefreshServices(false);
        });
    };
    refreshServices.timer = null;

    needRefreshServices = function(now)
    {
        if (refreshServices.timer !== null)
        {
            window.clearTimeout(refreshServices.timer);
            refreshServices.timer = null;
        }
        if (now)
        {
            refreshServices();
        }
        else
        {
            refreshServices.timer = window.setTimeout(refreshServices, REFRESH_SERVICES_TIMEOUT);
        }
    };

    $('#services').on('submit', 'form.service-action,form.service-signal', function(e)
    {
        e.preventDefault();
        $.post($(this).attr('action')).always(function()
        {
            needRefreshServices(true);
        });
        return false;
    });

    $('#service-refresh-interval').text(REFRESH_SERVICES_TIMEOUT / 1000);

    needRefreshServices(true);
})(jQuery, window);
