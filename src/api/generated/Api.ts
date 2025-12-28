/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Comet {
  /** ID */
  id?: number;
  /**
   * Наименование кометы
   * @minLength 1
   * @maxLength 200
   */
  name: string;
  /**
   * Описание расчёта
   * @minLength 1
   */
  description: string;
  /**
   * Цена расчёта, ₽
   * @min 0
   * @max 2147483647
   */
  price: number;
  /**
   * Ключ изображения в MinIO
   * @maxLength 100
   */
  image_key?: string | null;
  /** Image url */
  image_url?: string;
  /**
   * Коэффициент k_x (а.е.)
   * @format decimal
   */
  k_x: string;
  /**
   * Коэффициент k_y (а.е.)
   * @format decimal
   */
  k_y: string;
  /**
   * Коэффициент k_z (а.е.)
   * @format decimal
   */
  k_z: string;
}

export interface RequestComet {
  /** ID */
  id?: number;
  comet?: Comet;
  /** Comet id */
  comet_id: number;
  /**
   * Порядок
   * @min 0
   * @max 2147483647
   */
  sort_order?: number;
  /**
   * Координата X
   * @format decimal
   */
  coords_x: string;
  /**
   * Координата Y
   * @format decimal
   */
  coords_y: string;
  /**
   * Координата Z
   * @format decimal
   */
  coords_z: string;
  /**
   * Расстояние от Солнца, а.е.
   * @format decimal
   */
  distance_au?: string | null;
}

export interface Distance {
  /** ID */
  id?: number;
  /** Статус */
  status?: "draft" | "deleted" | "formed" | "completed" | "rejected";
  /**
   * Дата создания
   * @format date-time
   */
  created_at?: string;
  /** Astronomer login */
  astronomer_login?: string;
  /**
   * Дата формирования
   * @format date-time
   */
  formed_at?: string | null;
  /**
   * Дата завершения
   * @format date-time
   */
  completed_at?: string | null;
  /** Chief astronomer login */
  chief_astronomer_login?: string;
  /** Список телескопов */
  telescopes_list?: object;
  /** Calculated comets count */
  calculated_comets_count?: string;
  distance_comets?: RequestComet[];
}

export interface Login {
  /**
   * Email
   * @format email
   * @minLength 1
   */
  email: string;
  /**
   * Password
   * @minLength 1
   */
  password: string;
}

export interface User {
  /** ID */
  id?: number;
  /**
   * Username
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   * @minLength 1
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
  /**
   * Email
   * @format email
   * @minLength 1
   */
  email?: string;
  /**
   * Password
   * @minLength 1
   */
  password?: string;
  /**
   * Is superuser
   * @default false
   */
  is_superuser?: boolean;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "http://localhost:8000/api",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Comets API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://localhost:8000/api
 * @contact <contact@comets.local>
 *
 * API для расчета траекторий комет
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  comets = {
    /**
     * No description
     *
     * @tags comets
     * @name CometsList
     * @request GET:/comets/
     * @secure
     */
    cometsList: (params: RequestParams = {}) =>
      this.request<Comet[], any>({
        path: `/comets/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags comets
     * @name CometsCreate
     * @request POST:/comets/
     * @secure
     */
    cometsCreate: (data: Comet, params: RequestParams = {}) =>
      this.request<Comet, any>({
        path: `/comets/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags comets
     * @name CometsRead
     * @request GET:/comets/{id}/
     * @secure
     */
    cometsRead: (id: number, params: RequestParams = {}) =>
      this.request<Comet, any>({
        path: `/comets/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags comets
     * @name CometsUpdate
     * @request PUT:/comets/{id}/
     * @secure
     */
    cometsUpdate: (id: number, data: Comet, params: RequestParams = {}) =>
      this.request<Comet, any>({
        path: `/comets/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Логическое удаление услуги
     *
     * @tags comets
     * @name CometsDelete
     * @request DELETE:/comets/{id}/
     * @secure
     */
    cometsDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/comets/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Добавление изображения к услуге
     *
     * @tags comets
     * @name CometsAddImage
     * @request POST:/comets/{id}/addImage/
     * @secure
     */
    cometsAddImage: (id: number, data: Comet, params: RequestParams = {}) =>
      this.request<Comet, any>({
        path: `/comets/${id}/addImage/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавление услуги в заявку-черновик
     *
     * @tags comets
     * @name CometsAddToRequest
     * @request POST:/comets/{id}/addToRequest/
     * @secure
     */
    cometsAddToRequest: (id: number, data: Comet, params: RequestParams = {}) =>
      this.request<Comet, any>({
        path: `/comets/${id}/addToRequest/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  distance = {
    /**
     * No description
     *
     * @tags distance
     * @name DistanceList
     * @request GET:/distance/
     * @secure
     */
    distanceList: (params: RequestParams = {}) =>
      this.request<Distance[], any>({
        path: `/distance/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Получение информации о корзине (заявке-черновике)
     *
     * @tags distance
     * @name DistanceCartInfo
     * @request GET:/distance/cart_info/
     * @secure
     */
    distanceCartInfo: (params: RequestParams = {}) =>
      this.request<Distance[], any>({
        path: `/distance/cart_info/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Получение заявки по id без исключения draft/deleted (по методичке: GET одна запись).
     *
     * @tags distance
     * @name DistanceRead
     * @request GET:/distance/{id}/
     * @secure
     */
    distanceRead: (id: number, params: RequestParams = {}) =>
      this.request<Distance, any>({
        path: `/distance/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags distance
     * @name DistanceUpdate
     * @request PUT:/distance/{id}/
     * @secure
     */
    distanceUpdate: (id: number, data: Distance, params: RequestParams = {}) =>
      this.request<Distance, any>({
        path: `/distance/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Логическое удаление заявки
     *
     * @tags distance
     * @name DistanceDelete
     * @request DELETE:/distance/{id}/
     * @secure
     */
    distanceDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/distance/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Приём результата асинхронного сервиса с псевдоавторизацией по токену
     *
     * @tags distance
     * @name DistanceAsyncResult
     * @request PUT:/distance/{id}/async-result/
     * @secure
     */
    distanceAsyncResult: (
      id: number,
      data: Distance,
      params: RequestParams = {},
    ) =>
      this.request<Distance, any>({
        path: `/distance/${id}/async-result/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Завершение/отклонение заявки главным астрономом
     *
     * @tags distance
     * @name DistanceCompleteRequest
     * @request PUT:/distance/{id}/complete/
     * @secure
     */
    distanceCompleteRequest: (
      id: number,
      data: Distance,
      params: RequestParams = {},
    ) =>
      this.request<Distance, any>({
        path: `/distance/${id}/complete/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Формирование заявки создателем
     *
     * @tags distance
     * @name DistanceFormRequest
     * @request PUT:/distance/{id}/form_request/
     * @secure
     */
    distanceFormRequest: (
      id: number,
      data: Distance,
      params: RequestParams = {},
    ) =>
      this.request<Distance, any>({
        path: `/distance/${id}/form_request/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаление услуги из заявки по comet_id без PK м-м
     *
     * @tags distance
     * @name DistanceCometsDeleteCometFromRequest
     * @request DELETE:/distance/{request_id}/comets/delete/
     * @secure
     */
    distanceCometsDeleteCometFromRequest: (
      requestId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/distance/${requestId}/comets/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Изменение количества/порядка/координат по comet_id без PK м-м (deprecated)
     *
     * @tags distance
     * @name DistanceCometsUpdateCometInRequest
     * @request PUT:/distance/{request_id}/comets/update/
     * @secure
     */
    distanceCometsUpdateCometInRequest: (
      requestId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/distance/${requestId}/comets/update/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * @description Обновление м-м записи по request_id и comet_id
     *
     * @tags distance
     * @name DistanceUpdateCometById
     * @request PUT:/distance/{request_id}/comets/{comet_id}/
     * @secure
     */
    distanceUpdateCometById: (
      requestId: string,
      cometId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/distance/${requestId}/comets/${cometId}/`,
        method: "PUT",
        secure: true,
        ...params,
      }),
  };
  users = {
    /**
     * @description Аутентификация с установкой session_id cookie
     *
     * @tags users
     * @name UsersLogin
     * @request POST:/users/login/
     * @secure
     */
    usersLogin: (data: Login, params: RequestParams = {}) =>
      this.request<Login, any>({
        path: `/users/login/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Деавторизация через ViewSet (заменяет старый logout_view)
     *
     * @tags users
     * @name UsersLogout
     * @request POST:/users/logout/
     * @secure
     */
    usersLogout: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/logout/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Возвращает профиль текущего пользователя. Для анонимного пользователя явно отдаем 401 вместо попытки сериализовать AnonymousUser.
     *
     * @tags users
     * @name UsersProfileRead
     * @request GET:/users/profile/
     * @secure
     */
    usersProfileRead: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/profile/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersProfileUpdate
     * @request PUT:/users/profile/
     * @secure
     */
    usersProfileUpdate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/profile/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersRegister
     * @request POST:/users/register/
     * @secure
     */
    usersRegister: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users/register/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
