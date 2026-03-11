import 'package:passenger_app/features/auction/domain/entities/bid.dart';

abstract class AuctionRepository {
  Stream<List<Bid>> watchBids(String tripId);
  Future<void> acceptBid(String bidId);
  Future<void> rejectBid(String bidId);
}
