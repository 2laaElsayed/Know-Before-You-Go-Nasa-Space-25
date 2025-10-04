sealed class NetworkResult <t>{
  const NetworkResult();
}
class NetworkSuccess<T> extends NetworkResult<T> {
  NetworkSuccess(this.data);
  final T data;
}
class NetworkError<T> extends NetworkResult<T> {
  NetworkError(this.message);
  final String message;

}