from rest_framework import serializers
from .models import EventRegistration


class EventRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventRegistration
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate_payment_screenshot(self, value):
        """
        Validate payment screenshot file size and format.
        """
        if value:
            # Check file size (10MB max)
            if value.size > 10 * 1024 * 1024:
                raise serializers.ValidationError("Payment screenshot must be less than 10MB")
            
            # Check file format
            valid_types = ["image/jpeg", "image/png", "image/webp"]
            if value.content_type not in valid_types:
                raise serializers.ValidationError("Only JPG, PNG, and WEBP formats are allowed")
        
        return value

    def validate_parent_signature(self, value):
        """
        Validate parent signature file size and format (if provided).
        """
        if value:
            # Check file size (10MB max)
            if value.size > 10 * 1024 * 1024:
                raise serializers.ValidationError("Parent signature must be less than 10MB")
            
            # Check file format
            valid_types = ["image/jpeg", "image/png", "image/webp"]
            if value.content_type not in valid_types:
                raise serializers.ValidationError("Only JPG, PNG, and WEBP formats are allowed")
        
        return value

    def to_representation(self, instance):
        """
        Return absolute URLs for image fields.
        """
        representation = super().to_representation(instance)
        request = self.context.get('request')
        
        if request:
            if instance.payment_screenshot:
                representation['payment_screenshot'] = request.build_absolute_uri(instance.payment_screenshot.url)
            if instance.parent_signature:
                representation['parent_signature'] = request.build_absolute_uri(instance.parent_signature.url)
        
        return representation


class PaymentVerificationSerializer(serializers.ModelSerializer):
    """
    Serializer for updating payment verification status and notes.
    """
    class Meta:
        model = EventRegistration
        fields = ['payment_verified', 'notes']

