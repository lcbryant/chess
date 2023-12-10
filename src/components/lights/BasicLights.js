import { Group, SpotLight, AmbientLight, HemisphereLight } from 'three';

class BasicLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        const dir = new SpotLight(0xffffff, 4, 7, 1, 1, 1);
        const ambi = new AmbientLight(0x404040, 2);

        dir.castShadow = true;
        dir.position.set(0, 2, 0);
        dir.target.position.set(0, 0, 0);

        this.add(dir, ambi);
    }
}

export default BasicLights;
