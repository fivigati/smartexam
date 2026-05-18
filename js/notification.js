function showNotif(msg, type = 'info') {

    const n =
        document.getElementById(
            'notification'
        );

    const c =
        document.getElementById(
            'notif-color'
        );

    const i =
        document.getElementById(
            'notif-icon'
        );

    document.getElementById(
        'notif-message'
    ).innerText = msg;

    c.className =
        `w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
            type === 'error'
            ? 'bg-rose-500'
            : 'bg-emerald-500'
        }`;

    i.className =
        `fas ${
            type === 'error'
            ? 'fa-times'
            : 'fa-circle-check'
        }`;

    n.style.transform =
        'translateY(0) translateX(-50%)';

    setTimeout(() => {

        n.style.transform =
            'translateY(-250%) translateX(-50%)';

    }, 3000);
}
