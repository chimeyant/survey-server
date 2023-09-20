import { schema,rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { minLengthRule } from '@vinejs/vine/build/src/schema/record/rules'

export default class SendMessageValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    apiKey: schema.string(),
    //recieveNumber: schema.string({}, [rules.minLength(10), rules.maxLength(13)]),
    recieveNumber: schema.string({}, [ rules.mobile(), rules.minLength(9), rules.maxLength(13)]),
    message: schema.string()
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {
    'apiKey.required':"apiKey tidak boleh kosong",
    'recieveNumber.required':'recieveNumber tidak boleh kosong',
    'recieveNumber.minLenth': "nomor telpon tidak benar minimal 9 digit",
    'recieveNumber.maxLength': "nomor telpon tidak benar maksimal 13 digit",
    'recieveNumber.mobile': "nomor telpon tidak benar",
    'message.required': "Pesan tidak boleh kosong"
  }
}
