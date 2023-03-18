function isAlphaNumeric(c) {
    return c >= 65 && c <= 90 || c >= 97 && c <= 122 || c >= 48 && c <= 57 || c === 95; //A-Za-z0-9_
}
function leftPart(s, needle) {
    if (s == null)
        return null;
    let pos = s.indexOf(needle);
    return pos === -1
        ? s
        : s.substring(0, pos);
}
function withoutTrailingSlash(path) {
    return path && path[path.length-1] === '/'
        ? path.substring(0, path.length - 1)
        : path
}
const NoMix = ['nextjs','vue-vite','vue-ssg']
function updateTemplates() {
    let hasTag = location.search.indexOf('tag=') >= 0
    let name = $('#txtProjectName').val() || 'MyApp';
    let mix = !hasTag ? getMix() : null;
    let urlParams = 'Name=' + encodeURIComponent(name);
    if (location.search) {
        urlParams += '&' + location.search.substring(1)
    }
    if (mix) {
        urlParams += '&Mix=' + mix;
    }
    let defaultState = urlParams === 'Name=MyApp';
    if (defaultState) {
        history.replaceState(null,null,location.href.split('#')[0]);
        $('#reset').addClass('invisible');
    } else {
        history.replaceState(null,null,'#'+urlParams);
        $('#reset').removeClass('invisible');
    }

    $('.archive-url').each(function () {
        let url = leftPart(this.href, '?') + '?' + urlParams;
        if (NoMix.some(x => this.href.includes(x))) {
            url = leftPart(url, '&Mix')
        }
        this.href = templateUrlFilter(url);
    });
    $('.archive-name').each(function () {
        this.innerHTML = name + '.zip';
    });
    $('.project-name').each(function () {
        this.innerHTML = name;
    });

    $('#tool .copy-cmd label').html('x new web ' + name + (mix ? ' && cd ' + name + ' && x mix -f ' + mix.replace(/,/g,' ') : ''));
}
function getMix() {
    let mix = [];
    $('#mix input:checked').each(function () {
        mix.push(this.value);
    });
    return mix.join(',');
}
function templateUrlFilter(url) {
    return url
}

$('[name=auth-repo]').on('input', function () { $('#chkAuth').prop('checked',true) });
$('[name=action]').on('input', function () { $('#chkActionBuild').prop('checked',true) });
$('#mix [type=checkbox],#mix [type=radio]').on('input', updateTemplates);

let activePath = withoutTrailingSlash(location.pathname) + location.search
document.querySelectorAll('#templates-nav a').forEach(function(el) {
    if (el.getAttribute('href') === activePath) {
        el.parentElement.classList.add('active')
    }
})

function reset() {
    $('#txtProjectName').val('');
    $('#mix input:checked').prop('checked',false);
    updateTemplates();
}

function splitOnFirst(s, c) {
    if (!s) return [s];
    let pos = s.indexOf(c);
    return pos >= 0 ? [s.substring(0, pos), s.substring(pos + 1)] : [s];
}
function hashParams(url) {
    if (!url || url.indexOf('#') === -1) return {};
    let pairs = splitOnFirst(url, '#')[1].split('&');
    let map = {};
    for (let i = 0; i < pairs.length; ++i) {
        let p = pairs[i].split('=');
        map[p[0]] = p.length > 1
            ? decodeURIComponent(p[1].replace(/\+/g, ' '))
            : null;
    }
    return map;
}

if (location.hash) {
    let hash = hashParams(location.hash);
    if (hash.Name && hash.Name !== 'MyApp') {
        $('#txtProjectName').val(hash.Name);
    }
    if (hash.Mix) {
        let mix = hash.Mix.split(',');
        mix.forEach(function (id) {
            $(`input[value=${id}]`).prop('checked',true);
        });
    }
    updateTemplates();
}
else if (location.search) updateTemplates();

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

fetch(DYNAMIC_URL + "/stats/projects.json")
    .then(function (r) { return r.json(); })
    .then(function (obj) {
        let results = Object.assign({ 'vue-mjs':0,'razor-tailwind':0,'mvc-tailwind':0,'web-tailwind':0,'razor-pages':0 }, obj.Results || obj.results);
        Object.keys(results).forEach(function (k) {
            let count = results[k];
            let name = k.indexOf('/') >= 0
                ? k.replace('/','_')
                : 'netcoretemplates_' + k;
            let $count = $1('.' + name + ' .count');
            if (!$count) return;
            $count.innerHTML = count < 60
                ? '<span class="inline-flex items-center rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-medium text-pink-800">new</span>'
                : formatNumber(count) + ' installs';
        });
    })
