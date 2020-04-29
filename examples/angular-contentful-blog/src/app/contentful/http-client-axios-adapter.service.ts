import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpClientAxiosAdapterService {
  constructor(private httpClient: HttpClient) {}

  getAdapter() {
    return <T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
      const request = this.httpClient.request(
        config.method.toUpperCase(),
        this.buildFullPath(config.baseURL, config.url),
        {
          body: config.data,
          headers: config.headers,
          params: config.params,
          observe: 'response',
          withCredentials:
            config.withCredentials !== undefined
              ? !!config.withCredentials
              : undefined,
        }
      );

      return request
        .pipe(
          catchError(
            (response: HttpErrorResponse): Observable<never> =>
              throwError(
                this.createError(
                  response.message,
                  config,
                  response.name,
                  request,
                  response
                )
              )
          ),
          map(
            (response: HttpResponse<T>): AxiosResponse<T> => {
              const validateStatus = config.validateStatus;
              if (
                !response.status ||
                !validateStatus ||
                validateStatus(response.status)
              ) {
                return this.createResponse(config, request, response);
              } else {
                throwError(
                  this.createError(
                    `Request failed with status code ${response.status}`,
                    config,
                    null,
                    request,
                    response
                  )
                );
              }
            }
          )
        )
        .toPromise<AxiosResponse<T>>();
    };
  }

  /**
   * Creates a new URL by combining the baseURL with the requestedURL,
   * only when the requestedURL is not already an absolute URL.
   * If the requestURL is absolute, this function returns the requestedURL untouched.
   *
   * @param baseURL The base URL
   * @param requestedURL Absolute or relative URL to combine
   * @returns The combined full path
   */
  private buildFullPath(baseURL: string, requestedURL: string) {
    const isAbsoluteUrl: boolean = /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(
      requestedURL
    );

    if (baseURL && !isAbsoluteUrl) {
      return requestedURL
        ? baseURL.replace(/\/+$/, '') + '/' + requestedURL.replace(/^\/+/, '')
        : baseURL;
    }
    return requestedURL;
  }

  /**
   * Convert to an AxiosError with the specified message, config, error code, request and response.
   *
   * @param message The error message.
   * @param config The config.
   * @param code The error code (for example, 'ECONNABORTED').
   * @param request The request.
   * @param response The response.
   * @returns The created error.
   */
  private createError<T>(
    message: string,
    config: AxiosRequestConfig,
    code?: string,
    request?: Observable<HttpResponse<object>>,
    response?: HttpResponse<T> | HttpErrorResponse
  ): AxiosError<T> {
    const error = new Error(message);
    return this.enhanceError(error, config, code, request, response);
  }

  /**
   * Convert to a AxiosResponse with the specified config, request and response.
   *
   * @param config The config.
   * @param request The request.
   * @param response The response.
   * @returns The created response.
   */
  private createResponse<T>(
    config: AxiosRequestConfig,
    request: Observable<HttpResponse<object>>,
    response: HttpResponse<T> | HttpErrorResponse
  ): AxiosResponse<T> {
    const responseHeaders = response.headers
      .keys()
      .reduce((headersColl, headerKey) => {
        if (response.headers.has(headerKey)) {
          headersColl[headerKey] = response.headers.get(headerKey);
        }
        return headersColl;
      }, {});

    return {
      config,
      data: response instanceof HttpResponse ? response.body : response.error,
      headers: responseHeaders,
      request,
      status: response.status,
      statusText: response.statusText,
    };
  }

  /**
   * Update an Error with the specified config, error code, and response.
   *
   * @param error The error to update.
   * @param config The config.
   * @param code The error code (for example, 'ECONNABORTED').
   * @param request The request.
   * @param response The response.
   * @returns The error.
   */
  private enhanceError<T>(
    error: Error,
    config: AxiosRequestConfig,
    code?: string,
    request?: Observable<HttpResponse<object>>,
    response?: HttpResponse<T> | HttpErrorResponse
  ): AxiosError<T> {
    const axiosError: AxiosError<T> = error as AxiosError;
    axiosError.config = config;
    axiosError.request = request;
    axiosError.response = response
      ? this.createResponse(config, request, response)
      : null;
    axiosError.isAxiosError = true;

    if (code) {
      axiosError.code = code;
    }

    axiosError.toJSON = function () {
      return {
        code: this.code,
        config: this.config,
        name: this.name,
        message: this.message,
      };
    };

    return axiosError;
  }
}
