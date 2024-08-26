import { KindsEnum } from './kinds.ts';
import { MetaEnum } from './meta.ts';
import { SerializedObjectProperty } from './types.ts';

/**
 * A builder class for constructing a serialized object property.
 */
export class ObjectProperty {
	/**
	 * The id of the object. This is used to uniquely identify the object.
	 */
	private id?: string;

	/**
	 * The kind of the object. This is used to determine the type of the object. This is a simplied version of the TypeScript API's `SyntaxKinds`
	 */
	private kind?: KindsEnum;

	/**
	 * Meta information about the object, as boolean flags (if present it's true, absent is false) This includes
	 * metadata about the object such as whether it is a declaration, extends another object, or is read-only. This is a list of the available types:
	 */
	private meta: Set<MetaEnum> = new Set();

	/**
	 * The name of the objects and properties such as `String`, `ArrayConstructor`, and `encodeURI`.
	 */
	private name?: string;

	/**
	 * An array of `ObjectProperty` objects that represent function/method parameters.
	 */
	private parameters: ObjectProperty[] = [];

	/**
	 * Actual text of a language-defined keyword or token value, such as `string`, `await`.
	 */
	private text?: string;

	/**
	 * An array of `ObjectProperty` objects that represent the type(s) of an object, property, function return, etc.
	 */
	private type: ObjectProperty[] = [];

	/**
	 * An array of `ObjectProperty` objects that represent the type parameters of a generic type like `T`, `U`, etc.
	 */
	private typeParameters: ObjectProperty[] = [];

	/**
	 * Convert ObjectProperty instances into objects.
	 * @returns An object representation of the `ObjectProperty` instance.
	 */
	public serialize(): SerializedObjectProperty {
		return {
			id: this.id,
			kind: this.kind,
			meta: [...this.meta],
			name: this.name,
			parameters: this.parameters.map((p) => p.serialize()),
			text: this.text,
			type: this.getType(),
			typeParameters: this.typeParameters.map((p) => p.serialize()),
		};
	}

	/**
	 * Sets the unique identifier for this object.
	 * @param id The new identifier for this object.
	 * @returns A reference to this object for method chaining.
	 */
	public setId(id: string): this {
		this.id = id;
		return this;
	}

	/**
	 * Sets the kind of the ObjectProperty instance.
	 * @param kind The new kind to set for this ObjectProperty.
	 * @returns A reference to this ObjectProperty instance for method chaining.
	 */
	public setKind(kind: KindsEnum) {
		if (kind in KindsEnum) {
			this.kind = kind;
		}
		return this;
	}

	/**
	 * Gets the kind of the ObjectProperty instance.
	 * @returns The kind of the ObjectProperty instance.
	 */
	public getKind() {
		return this.kind;
	}

	/**
	 * Sets the meta types for this object property.
	 * @param metaTypes - An array of meta types to set for this object property.
	 * @returns A reference to this object property instance for method chaining.
	 */
	public setMeta(metaTypes: MetaEnum[]) {
		for (const meta of metaTypes) {
			this.meta.add(meta);
		}
		return this;
	}

	/**
	 * Adds a new meta type to the object property.
	 * @param metaType - The meta type to add to the object property.
	 * @returns A reference to this object property instance for method chaining.
	 */
	public addMeta(metaType: MetaEnum) {
		if (metaType && metaType in MetaEnum) {
			this.meta.add(metaType);
		}
		return this;
	}

	/**
	 * Checks if the object property has the specified meta type.
	 * @param metaType - The meta type to check for.
	 * @returns `true` if the object property has the specified meta type, `false` otherwise.
	 */
	public hasMeta(metaType: MetaEnum) {
		return this.meta.has(metaType);
	}

	/**
	 * Sets the name of the ObjectProperty instance.
	 * @param name - The new name to set for this ObjectProperty.
	 * @returns A reference to this ObjectProperty instance for method chaining.
	 */
	public setName(name?: string) {
		if (name) {
			this.name = name;
		}
		return this;
	}

	/**
	 * Gets the name of the ObjectProperty instance.
	 * @returns The name of the ObjectProperty instance.
	 */
	public getName() {
		return this.name;
	}

	/**
	 * Gets an array of serialized ObjectProperty instances representing the types of this ObjectProperty.
	 * @returns An array of serialized ObjectProperty instances.
	 */
	public getType(): SerializedObjectProperty[] {
		return this.type.map((u) => u.serialize());
	}

	/**
	 * Adds a new type to the ObjectProperty instance.
	 * @param type - The type to add to the ObjectProperty.
	 * @returns A reference to this ObjectProperty instance for method chaining.
	 */
	public addType(type?: ObjectProperty) {
		if (type && type instanceof ObjectProperty) {
			this.type.push(type);
		}
		return this;
	}

	/**
	 * Sets the parameters for this object.
	 * @param parameters - An array of ParameterBuilder instances to set as the parameters.
	 * @returns A reference to this ObjectProperty instance for method chaining.
	 */
	public setParameters(parameters: ObjectProperty[]) {
		if (parameters && Array.isArray(parameters)) {
			this.parameters = parameters;
		}
		return this;
	}

	/**
	 * Adds a new parameter to the ObjectProperty instance.
	 * @param parameter - The ParameterBuilder instance to add as a parameter.
	 * @returns A reference to this ObjectProperty instance for method chaining.
	 */
	public addParameter(parameter: ObjectProperty) {
		if (parameter && parameter instanceof ObjectProperty) {
			this.parameters.push(parameter);
		}
		return this;
	}

	/**
	 * Sets the type parameters for this ObjectProperty instance.
	 * @param typeParameters - An array of ParameterBuilder instances to set as the type parameters.
	 * @returns A reference to this ObjectProperty instance for method chaining.
	 */
	public setTypeParameters(typeParameters: ObjectProperty[]) {
		if (typeParameters && Array.isArray(typeParameters)) {
			this.typeParameters = typeParameters;
		}
		return this;
	}

	/**
	 * Adds a new type parameter to the ObjectProperty instance.
	 * @param typeParameter - The ParameterBuilder instance to add as a type parameter.
	 * @returns A reference to this ObjectProperty instance for method chaining.
	 */
	public addTypeParameter(typeParameter: ObjectProperty) {
		if (typeParameter && typeParameter instanceof ObjectProperty) {
			this.typeParameters.push(typeParameter);
		}
		return this;
	}

	/**
	 * Sets the text property of this object.
	 * @param text - The new text value to set, or undefined to clear the text.
	 * @returns A reference to this ObjectProperty instance for method chaining.
	 */
	public setText(text?: string) {
		if (text) {
			this.text = text;
		}
		return this;
	}
}
