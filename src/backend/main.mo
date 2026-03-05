import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  // Include prefabricated components (logic will be inlined)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Types
  type PhotoCategory = { #editorial; #commercial; #runway; #lifestyle };

  module PhotoCategory {
    public func compare(cat1 : PhotoCategory, cat2 : PhotoCategory) : Order.Order {
      switch (cat1, cat2) {
        case (#editorial, #editorial) { #equal };
        case (#commercial, #commercial) { #equal };
        case (#runway, #runway) { #equal };
        case (#lifestyle, #lifestyle) { #equal };
        case (#editorial, _) { #less };
        case (#commercial, #editorial) { #greater };
        case (#commercial, _) { #less };
        case (#runway, #lifestyle) { #less };
        case (#runway, _) { #greater };
        case (#lifestyle, _) { #greater };
      };
    };
  };

  type Photo = {
    id : Text;
    blob : Storage.ExternalBlob;
    caption : Text;
    category : PhotoCategory;
    displayOrder : Nat;
    createdAt : Int;
  };

  module Photo {
    public func compareByCategory(photo1 : Photo, photo2 : Photo) : Order.Order {
      switch (PhotoCategory.compare(photo1.category, photo2.category)) {
        case (#equal) { Text.compare(photo1.caption, photo2.caption) };
        case (order) { order };
      };
    };
  };

  type ModelStats = {
    height : Float;
    chest : Float;
    waist : Float;
    hips : Float;
    shoes : Float;
    agencyName : Text;
    agencyUrl : Text;
    experience : Nat;
  };

  type ContactInfo = {
    email : Text;
    phone : Text;
    instagram : Text;
    location : Text;
  };

  // State
  let photos = Map.empty<Text, Photo>();
  var bio = "";
  var modelStats : ?ModelStats = null;
  var contactInfo : ?ContactInfo = null;
  var sectionOrder : [Text] = [ "hero", "about", "portfolio", "stats", "contact" ];

  // Seed sample data
  public shared ({ caller }) func initialize() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (bio != "") { Runtime.trap("Already initialized") };

    // Sample bio
    bio := "Professional male model with experience in editorial, commercial, and runway work.";

    // Sample stats
    modelStats := ?{
      height = 6.2;
      chest = 40.0;
      waist = 32.0;
      hips = 38.0;
      shoes = 10.5;
      agencyName = "Elite Models";
      agencyUrl = "https://elitemodels.com";
      experience = 5;
    };

    // Sample contact
    contactInfo := ?{
      email = "model@example.com";
      phone = "+1234567890";
      instagram = "@modelhandle";
      location = "New York, NY";
    };

    // Sample section order
    sectionOrder := [ "hero", "about", "portfolio", "stats", "contact" ];
  };

  // Photos CRUD
  public shared ({ caller }) func addPhoto(photo : Photo) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    photos.add(photo.id, photo);
  };

  public shared ({ caller }) func updatePhoto(photo : Photo) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not photos.containsKey(photo.id)) { Runtime.trap("Photo not found") };
    photos.add(photo.id, photo);
  };

  public query ({ caller }) func getPhoto(id : Text) : async Photo {
    switch (photos.get(id)) {
      case (null) { Runtime.trap("Photo not found") };
      case (?photo) { photo };
    };
  };

  public query ({ caller }) func getAllPhotos() : async [Photo] {
    photos.values().toArray();
  };

  public query ({ caller }) func getPhotosByCategory(category : PhotoCategory) : async [Photo] {
    photos.values().toArray().filter(func(photo) { photo.category == category });
  };

  public shared ({ caller }) func deletePhoto(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not photos.containsKey(id)) { Runtime.trap("Photo not found") };
    photos.remove(id);
  };

  public shared ({ caller }) func reorderPhotos(newOrder : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    for (i in newOrder.keys()) {
      let id = newOrder[i];
      switch (photos.get(id)) {
        case (null) {};
        case (?photo) {
          let updatedPhoto = { photo with displayOrder = i + 1 };
          photos.add(id, updatedPhoto);
        };
      };
    };
  };

  // Bio/About
  public shared ({ caller }) func updateBio(newBio : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    bio := newBio;
  };

  public query ({ caller }) func getBio() : async Text {
    bio;
  };

  // Model Stats
  public shared ({ caller }) func updateModelStats(stats : ModelStats) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    modelStats := ?stats;
  };

  public query ({ caller }) func getModelStats() : async ?ModelStats {
    modelStats;
  };

  // Contact Info
  public shared ({ caller }) func updateContactInfo(contact : ContactInfo) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    contactInfo := ?contact;
  };

  public query ({ caller }) func getContactInfo() : async ?ContactInfo {
    contactInfo;
  };

  // Section Order
  public shared ({ caller }) func updateSectionOrder(newOrder : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    sectionOrder := newOrder;
  };

  public query ({ caller }) func getSectionOrder() : async [Text] {
    sectionOrder;
  };
};
