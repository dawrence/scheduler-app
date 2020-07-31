# frozen_string_literal: true

module Api
  module V1
    # :nodoc:
    class UrlsController < ApiController
      def latest
        @urls = Url.latest
        render json: @urls
      end

      def index
        # not useful
      end

      def create
        @url = Url.new(safe_params)
        render json: @url if @url.save!
      end

      def show
        @url = Url.find_by!(short_url: params[:url])
        render json: @url, include: 'clicks'
      end

      def visit
        @url = Url.find_by!(short_url: params[:url])

        render json: @url, include: 'clicks', status: 302 if @url.perform_click!(
          browser.name,
          browser.platform
        )
      end

      def safe_params
        params.permit(:original_url)
      end
    end
  end
end
