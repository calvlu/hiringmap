    mapboxgl.accessToken = 'pk.eyJ1IjoiY2Fsdmx1IiwiYSI6ImNraDVrdno0MzBtcXEycW92dGtqbmRzOGMifQ.DcBDLkgaiyFIsaEr_389Xw';
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/calvlu/ckm0jta9h3az217ovunmyuqjp',
      center: [-3.632, 0.339],
      zoom: 4.3,
      scrollZoom: false,
      dragPan: false
    });

    var months = [
      'February 2020',
      'March 2020',
      'April 2020',
      'May 2020',
      'June 2020',
      'July 2020',
      'August 2020',
      'September 2020',
      'October 2020',
      'November 2020',
      'December 2020',
      'January 2021',
      'February 2021',
      'March 2021'
    ];

    function filterBy(month) {
      var filters = ['==', 'month', month + 2];
      map.setFilter('hiring-fill', filters);

      // Set the label to the month
      document.getElementById('month').textContent = months[month];
    }

    map.on('load', function() {
      map.addSource('hiringalbers', {
        type: 'vector',
        url: 'mapbox://calvlu.19m1mm6j'
      });
      map.addLayer({
        'id': 'hiring-fill',
        'type': 'fill',
        'source': 'hiringalbers',
        'source-layer': 'hiringalbers',
        'paint': {
          'fill-color': [
            'interpolate', ['linear'],
            ['get', 'pct_chng_feb_1'],
            -50,
            '#e07938',
            -30,
            '#eb9c60',
            -10,
            '#f3bd86',
            0,
            '#f8ddaf',
            5,
            '#8280ff',
            15,
            '#4d64ff',
            25,
            '#0029e0'
          ],
          'fill-opacity': 0.9
        }
      }, 'state-boundaries');

      const legend = document.getElementById('legend');
      const legendColors = document.getElementById('legend-colors');
      const legendValues = document.getElementById('legend-values');
      const legValues = [-50, -30, -10, 0, 5, 15, 25];
      const legColors = ['#e07938', '#eb9c60', '#f3bd86', '#f8ddaf', '#8280ff', '#4d64ff', '#0029e0'];
      legend.classList.add('block-ml');
      legValues.forEach((stop, idx) => {
        const key = `<div class='col h12' style='background-color:${legColors[idx]}'></div>`;
        const value = `<div class='col align-center'>${stop}</div>`;
        legendColors.innerHTML += key;
        legendValues.innerHTML += value;
      });


      // Set filter to first month of the year
      // 0 = January
      filterBy(0);

      document
        .getElementById('slider')
        .addEventListener('input', function(e) {
          var month = parseInt(e.target.value, 10);
          filterBy(month);
        });
      var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      map.on('mousemove', 'hiring-fill', function(e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        var description = `<h3>${e.features[0].properties.NAME}</h3>
          <p><b>${Math.round(e.features[0].properties.pct_chng_feb_1*100)/100}% </b>change in job postings</p>`;

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(e.lngLat).setHTML(description).addTo(map);
      });

      map.on('mouseleave', 'hiring-fill', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });
    });