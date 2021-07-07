namespace :cash_flow do
  task seed_up: :environment do
    CashFlow.destroy_all
		Student.all.each do |student|
      student.license_type.scan(/a2|b1|c1/i).each do |license_type|
        case license_type
        when /a2/i
          student.cash_flows.inscribe(amount: CashFlow::INSCRIPTION_A2, concept: "Inscripcion a #{license_type}")
        when /b1/i
          student.cash_flows.inscribe(amount: CashFlow::INSCRIPTION_B1, concept: "Inscripcion a #{license_type}")
        when /c1/i
          student.cash_flows.inscribe(amount: CashFlow::INSCRIPTION_C1, concept: "Inscripcion a #{license_type}")
        end
      end
      student.fines.each do |fine|
        if fine.paid
          student.cash_flows.set_fine
          student.cash_flows.create(kind: 'pay', amount: Fine::VALUE, concept: 'Pagó multa')
        else
          student.cash_flows.set_fine
        end
      end
      student.action_logs.order(created_at: :asc).each do |action_log|
        if /cancelo (?:la )?totalidad(?:.*?(?<amount>\d+(\.\d+)?))?/i =~ action_log.content
          if amount
            student.cash_flows.create(kind: 'pay', amount: amount.gsub(".", ""), concept: 'Cancelo la totalidad')
          else
            amount = student.cash_flows.total_debt
            student.cash_flows.create(kind: 'pay', amount: amount, concept: 'Cancelo la totalidad')
          end
        elsif /(?<concept>paga|pago|abono|abona) *: *(?<amount>\d+(?:\.\d+)?)/i =~ action_log.content
          if concept
            student.cash_flows.create(kind: 'pay', amount: amount.gsub(".", ""), concept: concept.capitalize)
          end
        end
      end
    end
	end 
end