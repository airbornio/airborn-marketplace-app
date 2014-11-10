var apps = document.getElementById('apps');
var search = document.getElementById('search');

function searchApps() {
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(req.readyState === 4 && req.status === 200) {
			var resp = JSON.parse(req.responseText);
			apps.innerHTML = '';
			resp.objects.forEach(function(object) {
				var app = document.createElement('div');
				app.className = 'app';
				var icon = document.createElement('img');
				icon.src = object.icons[64];
				app.appendChild(icon);
				var name = document.createElement('div');
				name.className = 'name';
				name.appendChild(document.createTextNode(object.name[object.default_locale]));
				app.appendChild(name);
				var description = document.createElement('span');
				description.className = 'description';
				description.appendChild(document.createTextNode(object.description[object.default_locale]));
				description.innerHTML = object.description[object.default_locale].replace(
					/<(?!(?:\/)?(?:a|ul|li|strong|b|em|i)(?: |>))/ig, '&lt;'
				);
				app.appendChild(description);
				app.appendChild(document.createElement('br'));
				var expandLink = document.createElement('a');
				expandLink.href = '#';
				expandLink.addEventListener('click', function(evt) {
					if(app.classList.toggle('expanded')) {
						expandLink.textContent = 'Read less…';
					} else {
						expandLink.textContent = 'Read more…';
					}
				});
				expandLink.textContent = 'Read more…';
				app.appendChild(expandLink);
				var installLink = document.createElement('a');
				installLink.className = 'installLink';
				installLink.href = '#';
				installLink.addEventListener('click', function(evt) {
					evt.preventDefault();
					installLink.textContent = 'Installing…';
					var request = navigator.mozApps.installPackage(object.manifest_url, {catagories: object.categories});
					request.onsuccess = function() {
						console.log(request);
						installLink.textContent = 'Installed';
					};
					request.onerror = function() {
						console.log(request);
						installLink.textContent = 'There was an error. Try again';
					};
				});
				installLink.textContent = 'Install';
				app.appendChild(installLink);
				apps.appendChild(app);
			});
		}
	};
	req.open('GET', 'https://marketplace.firefox.com/api/v2/apps/search/?q=' + encodeURIComponent(search.value) + '&dev=desktop&app_type=packaged');
	req.send();
}

searchApps();

document.getElementById('search').addEventListener('change', searchApps);