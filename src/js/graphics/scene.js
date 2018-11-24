"use strict";

//
// scene.js -- The scene graph model
//

/**
 * High-level abstraction for object transformation matrix manipulation.
 */
class Transform {
    /**
     * Initialize a default transformation. This means there is no translation,
     * no rotation, and a scale of 1.
     */
    constructor() {
        this.dirty = false;
        this.mat = mat4.create();
        this.translate = vec3.create();
        this.rotate = quat.create();
        this.scale = vec3.fromValues(1, 1, 1);
    }

    /**
     * Sets this transform's absolute scale.
     * @param {vec3} v The new scale vector of the transformation.
     * @returns {Transform} this, to allow for operation chaining.
     */
    scaleAbs(v) {
        vec3.copy(this.scale, v);
        this.dirty = true;
        return this;
    }

    /**
     * Modifies this transform's current scale by a value.
     * @param {vec3} v The vector by which the current scale will be modified.
     * @returns {Transform} this, to allow for operation chaining.
     */
    scaleBy(v) {
        vec3.mul(this.scale, this.scale, v);
        this.dirty = true;
        return this;
    }

    /**
     * Sets this transform's absolute rotation.
     * @param {quat} q The new rotation quaternion of the transformation.
     * @returns {Transform} this, to allow for operation chaining.
     */
    rotateAbs(q) {
        quat.copy(this.rotate, q);
        this.dirty = true;
        return this;
    }

    /**
     * Modifies this transform's current rotation by a value.
     * @param {quat} q The quaternion by which the current rotation will be 
     *                 modified.
     * @returns {Transform} this, to allow for operation chaining.
     */
    rotateBy(q) {
        quat.mul(this.rotate, this.rotate, q);
        this.dirty = true;
        return this;
    }

    /**
     * Sets this transform's absolute translation.
     * @param {vec3} v The new translation vector of the transformation.
     * @returns {Transform} this, to allow for operation chaining.
     */
    translateAbs(v) {
        vec3.copy(this.translate, v);
        this.dirty = true;
        return this;
    }

    /**
     * Modifies this transform's current position by a value.
     * @param {vec3} v The vector by which the current translation will be
     *                 modified.
     * @returns {Transform} this, to allow for operation chaining.
     */
    translateBy(v) {
        vec3.add(this.translate, this.translate, v);
        this.dirty = true;
        return this;
    }

    /**
     * Updates the internal transformation matrix if necessary and fetches it.
     */
    get matrix() {
        if (this.dirty) {
            mat4.fromRotationTranslationScale(this.mat, this.rotate,
                this.tranlsate, this.scale);
            this.dirty = false;
        }
        return this.mat;
    }
}

/**
 * An object in a scene.
 */
class SceneObject {
    /**
     * Create a RenderObject
     * @param {String} name Name of the object.
     */
    constructor(name) {
        /**
         * Name of the object, for debugging purposes.
         */
        this.name = name;
        /**
         * 3D transformation of the object, relative to its parent.
         */
        this.transform = new Transform();
        /**
         * Child objects of this object.
         */
        this.children = [];
    }

    /**
     * Update the object.
     * @param {Number} now The time since the start of the app, in seconds.
     */
    update(now) { }

    /**
     * Render the object.
     * @param {Number} now The time since the start of the app, in seconds.
     */
    render(now) { }
}