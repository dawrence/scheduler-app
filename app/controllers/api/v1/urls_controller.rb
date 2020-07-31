# frozen_string_literal: true

module Api
  module V1
    # :nodoc:
    class UrlsController < ApiController
      def latest
        @urls = Url.latest
        render json: @urls
      end

      def create
        @url = Url.new(safe_params)
        render json: @url if @url.save!
      end

      def show
        @url = Url.find_by!(short_url: params[:url])
        render json: @url, include: 'clicks'
      end

      def stats
        # TODO
      end

      def safe_params
        params.permit(:original_url)
      end
    end
  end
end
