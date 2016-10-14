class NSMS {
  constructor(parent = document.body, debug_log = false) {
    if (parent && typeof parent.appendChild == 'function') {
      parent.classList.add("is-loading");

      this.factor = 10;

      this.board = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      this.board.setAttribute('viewBox', `0 0 ${parent.offsetWidth} ${parent.offsetHeight}`);
      parent.appendChild(this.board);

      this.universe = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      this.world = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      this.clients = document.createElementNS('http://www.w3.org/2000/svg', 'g');

      this.client_objs = [];

      this.universe.appendChild(this.world);
      this.universe.appendChild(this.clients);

      this.board.appendChild(this.universe);

      parent.classList.remove('is-loading');

      this.log('Board available');

      this.border = this.draw(this.world, 'rect', {
        'x': 0,
        'y': 0,
        'width': parent.offsetWidth,
        'height': parent.offsetHeight,
        'fill': "rgba(0,0,25,.1)"
      });

      this.border = this.draw(this.world, 'rect', {
        'x': (parent.offsetWidth * .333),
        'y': 0,
        'width': parent.offsetWidth * .333,
        'height': parent.offsetHeight,
        'stroke': 'rgba(0,0,25,.2)',
        'fill': 'rgba(0,0,25,.1)'
      });

      this.current_client = this.drawClient(true, {x: parent.offsetWidth * .5, y: 20 + Math.random() * (parent.offsetHeight - 20)});

      this.client_objs.push(this.current_client);

      if (this.current_client && window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", (event) => {
          this.rotateClientEye(this.current_client, event.alpha);
          this.calcSide(this.current_client, event.gamma);
        }, true);
      }

      return {
        log: this.log.bind(this),
        drawClient: this.drawClient.bind(this),
        draw: this.draw.bind(this)
      }
    } else {
      this.error(`${parent} of type "${typeof parent}" is not a valid DOM node`);
    }

    return false;
  }

  drawClient(is_self, pos) {
    let stroke = '';
    let stroke_width = '';

    if (is_self) {
      stroke = '#fff';
      stroke_width = '2';
    }

    const shape_group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    shape_group.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);
    shape_group.setAttribute('class', 'client');

    const shape_element = this.draw(shape_group, 'circle', {
      'cx': 0,
      'cy': 0,
      'r': 20,
      'stroke': stroke,
      'stroke-width': stroke_width,
      'class': 'body'
    });

    const shape_eye = this.draw(shape_group, 'circle', {
      'cx': 10,
      'cy': 0,
      'r': 3,
      'class': 'eye'
    });

    this.clients.appendChild(shape_group);

    this.log(`Drawing a client at [${pos.x} : ${pos.y}]`);

    const shape_obj = {
      pos: pos,
      shape_group: shape_group,
      shape_element: shape_element,
      shape_eye: shape_eye
    }

    return shape_obj;
  }

  rotateClientEye(shape_obj, angle) {
    if (angle) {
      shape_obj.shape_eye.setAttribute('transform', `rotate(${angle})`);
    }
  }

  calcSide(shape_obj, angle) {
    if (angle) {
      const shape_group = shape_obj.shape_group;

      if (angle < -90) {
        angle = -90;
      }
      if (angle > 90) {
        angle = 90;
      }

      this.moveShape(shape_group, {x: (document.body.offsetWidth * .5) + ((angle/90) * (document.body.offsetWidth - 80) * .5 ), y: shape_obj.pos.y});

      shape_group.classList.remove("positive");
      shape_group.classList.remove("negative");
      shape_group.classList.remove("neutral");

      if (angle > 38) {
        shape_group.classList.add("positive");
      } else if (angle < -38) {
        shape_group.classList.add("negative");
      } else {
        shape_group.classList.add("neutral");
      }
    }
  }

  moveShape(shape_obj, pos) {
    console.log(pos);
    shape_obj.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);
  }

  draw(parent, shape, atts) {
    const shape_element = document.createElementNS('http://www.w3.org/2000/svg', shape);

    for (let key in atts) {
      shape_element.setAttribute(key, atts[key]);
    }

    parent.appendChild(shape_element);

    return shape_element;
  }

  log(message) {
    if (debug_log) {
      debug_log.log(message);
    } else {
      console.log(message);
    }

    return true;
  }

  error(message) {
    this.log('NSMS Error: ' + message);

    return true;
  }
}
